import debug from 'debug';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { Command } from './command.js';
import { ShowtimesBlame } from './showtimes_blame.js';

const SHOWTIMES = {
  SERVER: process.env.SHOWTIMES_SERVER,
  KEY: process.env.SHOWTIMES_KEY,
};

const log = debug('Showtimes');

export class ShowtimesStaff extends Command {
  constructor(client, authorized) {
    super(client);
    this.isAuthorized = authorized;
    this.blame = new ShowtimesBlame(client);
  }

  message(from, to, text) {
    const showtimesRegex = /^(?:[.!])(?:(?:(done|undone) (tl|tlc|enc|ed|tm|ts|qc) (.+))|(?:(?:(done|undone) (.+?)(?: !(\w+))?)))$/i;
    const showtimes = text.match(showtimesRegex);

    if (showtimes) {
      this.isAuthorized(from).then(auth => {
        if (auth) {
          let status = null;
          let position = null;
          let show = null;

          if (showtimes[2]) {
            [, status, position, show] = showtimes;
          } else {
            [,,,, status, show, position] = showtimes;
          }

          this.showtimesRequest(from, to, status, show, position).then(response => {
            const msg = response;

            this.blame.blameRequest(from, to, show, true).then(res => {
              this.send(to, `${msg}. ${res}`);
            });
          }, error => {
            this.send(to, 'Error connecting to Deschtimes');
            log(`Error: ${error.message}`);
            return error;
          });
        }
      });
    }
  }

  showtimesRequest(from, to, status, show, position) {
    log(`Request by ${from} in ${to} for ${show} [${position}]: ${status}`);

    const form = new FormData();
    form.append('username', from);
    form.append('status', this.convertStatus(status));
    form.append('irc', to);
    form.append('name', show.trim());
    form.append('auth', SHOWTIMES.KEY);

    if (position) {
      form.append('position', position);
    }

    return fetch(`${SHOWTIMES.SERVER}/staff`, { method: 'PUT', body: form }).then(response => {
      if (response.ok) {
        return response.json().then(data => data.message);
      }

      return response.json().then(data => Promise.reject(new Error(data.message)));
    }).catch(error => Promise.reject(error));
  }

  convertStatus(status) {
    return (status === 'done' ? 'true' : 'false');
  }

  help(from) {
    this.client.notice(from, `.(done|undone) show [!position]; marks (optional) position as done.`);
  }
}
