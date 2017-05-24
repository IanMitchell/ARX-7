import debug from 'debug';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { Command } from './command.js';
import { ShowtimesError } from '../modules/custom_errors';

const log = debug('Release');
const SHOWTIMES = {
  SERVER: process.env.SHOWTIMES_SERVER,
  KEY: process.env.SHOWTIMES_KEY,
};

export class ShowtimesRelease extends Command {
  constructor(client, authorized) {
    super(client);
    this.isAuthorized = authorized;
  }

  message(from, to, text) {
    const releaseRegex = /^[.!]release\s(.+)$/i;
    const release = text.match(releaseRegex);

    if (release) {
      this.isAuthorized(from).then(auth => {
        if (auth) {
          this.releaseRequest(from, to, release[1]).then(response => {
            this.send(to, response);
          }, error => {
            if (error instanceof ShowtimesError) {
              this.send(to, error.message);
            } else {
              this.send(to, 'Sorry, there was an error. Poke Desch');
            }

            log(`Error: ${error.message}`);
            return error;
          });
        }
      });
    }
  }

  releaseRequest(from, to, show) {
    log(`Release request by ${from} in ${to} for ${show}`);

    const form = new FormData();
    form.append('irc', to);
    form.append('name', show.trim());
    form.append('username', from);
    form.append('auth', SHOWTIMES.KEY);

    return fetch(`${SHOWTIMES.SERVER}/release`, { method: 'PUT', body: form }).then(response => {
      if (response.ok) {
        return response.json().then(data => data.message);
      }

      return response.json().then(data => Promise.reject(new ShowtimesError(data.message)));
    }).catch(error => Promise.reject(error));
  }

  help(from) {
    this.client.notice(from, `.release show; marks show as finished.`);
  }
}
