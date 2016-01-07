import debug from 'debug';
import FormData from 'form-data';
import fetch from 'node-fetch';
import config from './../../config';
import { Command } from './command.js';
import { Blame } from './blame.js';

const log = debug('Showtimes');
const SHOWTIMES_URL = `${config.showtimes.server}`;

export class Showtimes extends Command {
  constructor(client, authorized) {
    super(client);
    this.isAuthorized = authorized;
    this.blame = new Blame(client);
  }

  message(from, to, text) {
    const showtimesRegex = /^[.!](?:(?:st|(?:show(?:times)?))(?:\s))?(done|undone)(?:\s)(.+?)(?:\s!(\w+))?$/i;
    const releaseRegex = /^[.!]release\s(.+)$/i;

    const showtimes = text.match(showtimesRegex);
    const release = text.match(releaseRegex);

    if (showtimes) {
      this.isAuthorized(from).then(auth => {
        if (auth) {
          return new Promise((resolve, reject) => {
            const [, status, show, position] = showtimes;

            this.showtimesRequest(from, to, status, show, position).then(response => {
              const msg = response;

              this.blame.blameRequest(from, to, show).then(res => {
                this.send(to, `${msg}. ${res}`);
                return resolve();
              });
            }, error => {
              this.send(to, error.message);
              log(`Error: ${error.message}`);
              return reject(error);
            });
          });
        }
      });
    } else if (release) {
      this.isAuthorized(from).then(auth => {
        if (auth) {
          return new Promise((resolve, reject) => {
            this.releaseRequest(from, to, release[1]).then(response => {
              this.send(to, response);
              return resolve();
            }, error => {
              this.send(to, error.message);
              log(`Error: ${error.message}`);
              return reject(error);
            });
          });
        }
      });
    }
  }

  showtimesRequest(from, to, status, show, position) {
    log(`Request by ${from} in ${to} for ${show} [${position}]: ${status}`);

    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('username', from);
      form.append('status', this.convertStatus(status));
      form.append('irc', to);
      form.append('name', show);
      form.append('auth', config.showtimes.key);

      if (position) {
        form.append('position', position);
      }

      fetch(`${SHOWTIMES_URL}/staff`, { method: 'PUT', body: form }).then(response => {
        if (response.ok) {
          response.json().then(data => resolve(data.message));
        } else {
          response.json().then(data => reject(Error(data.message)));
        }
      }).catch(error => reject(Error(error)));
    });
  }

  releaseRequest(from, to, show) {
    log(`Release request by ${from} in ${to} for ${show}`);

    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('irc', to);
      form.append('name', show);
      form.append('auth', config.showtimes.key);

      fetch(`${SHOWTIMES_URL}/release`, { method: 'PUT', body: form }).then(response => {
        if (response.ok) {
          response.json().then(data => resolve(data.message));
        } else {
          response.json().then(data => reject(Error(data.message)));
        }
      }).catch(error => reject(Error(error)));
    });
  }

  convertStatus(status) {
    if (status === 'done') {
      return 'true';
    }

    return 'false';
  }

  help(from) {
    this.client.notice(from, `.release show; marks show as finished. .(done|undone) show [!position]; marks (optional) position as done.`);
  }
}
