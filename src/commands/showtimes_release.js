import debug from 'debug';
import FormData from 'form-data';
import fetch from 'node-fetch';
import config from './../../config';
import { Command } from './command.js';

const log = debug('Release');
const SHOWTIMES_URL = `${config.showtimes.server}`;

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
            this.send(to, error.message);
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
    form.append('auth', config.showtimes.key);

    return fetch(`${SHOWTIMES_URL}/release`, { method: 'PUT', body: form }).then(response => {
      if (response.ok) {
        return response.json().then(data => data.message);
      }

      return response.json().then(data => Error(data.message));
    }).catch(error => Error(error));
  }

  help(from) {
    this.client.notice(from, `.release show; marks show as finished.`);
  }
}
