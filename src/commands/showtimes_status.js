import debug from 'debug';
import FormData from 'form-data';
import fetch from 'node-fetch';
import config from './../../config';
import { Command } from './command.js';
import { ShowtimesBlame } from './showtimes_blame.js';

const log = debug('Showtimes');
const SHOWTIMES_URL = `${config.showtimes.server}`;

export class ShowtimesStatus extends Command {
  constructor(client, authorized) {
    super(client);
    this.isAuthorized = authorized;
    this.blame = new ShowtimesBlame(client);
  }

  message(from, to, text) {
    const showtimesRegex = /^[.!](?:(?:st|(?:show(?:times)?))(?:\s))?(done|undone)(?:\s)(.+?)(?:\s!(\w+))?$/i;
    const showtimes = text.match(showtimesRegex);

    if (showtimes) {
      this.isAuthorized(from).then(auth => {
        if (auth) {
          const [, status, show, position] = showtimes;

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
    form.append('auth', config.showtimes.key);

    if (position) {
      form.append('position', position);
    }

    return fetch(`${SHOWTIMES_URL}/staff`, { method: 'PUT', body: form }).then(response => {
      if (response.ok) {
        return response.json().then(data => data.message);
      }

      return response.json().then(data => Error(data.message));
    }).catch(error => Error(error));
  }

  convertStatus(status) {
    if (status === 'done') {
      return 'true';
    }

    return 'false';
  }

  help(from) {
    this.client.notice(from, `.(done|undone) show [!position]; marks (optional) position as done.`);
  }
}
