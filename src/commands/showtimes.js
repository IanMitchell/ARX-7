import debug from 'debug';
import FormData from 'form-data';
import fetch from 'node-fetch';
import config from './../../config';
import { Command } from './command.js';
import colors from 'irc-colors';
import moment from 'moment';

const log = debug('Showtimes');
const SHOWTIMES_URL = `${config.showtimes.server}`;

export class Showtimes extends Command {
  message(from, to, text) {
    const showtimesRegex = /^[.!](?:(?:st|(?:show(?:times)?))(?:\s))?(done|undone)(?:\s)(.+?)(?:\s!(\w+))?$/i;
    const blameRegex = /^[.!](?:show|blame)\s(.+)$/i;
    const releaseRegex = /^[.!]release\s(.+)$/i;

    const showtimes = text.match(showtimesRegex);
    const blame = text.match(blameRegex);
    const release = text.match(releaseRegex);

    if (showtimes) {
      return new Promise((resolve, reject) => {
        const [, status, show, position] = showtimes;

        this.showtimesRequest(from, to, status, show, position).then(response => {
          this.send(to, response);
          return resolve();
        }, error => {
          this.send(to, error.message);
          log(`Error: ${error.message}`);
          return reject(error);
        });
      });
    } else if (blame) {
      return new Promise((resolve, reject) => {
        this.blameRequest(from, to, blame[1]).then(response => {
          this.send(to, response);
          return resolve();
        }, error => {
          this.send(to, error.message);
          log(`Error: ${error.message}`);
          return reject(error);
        });
      });
    } else if (release) {
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

  blameRequest(from, to, show) {
    log(`Blame request by ${from} in ${to} for ${show}`);

    return new Promise((resolve, reject) => {
      let uri = `${SHOWTIMES_URL}/blame.json?`;
      uri += `irc=${encodeURIComponent(to)}`;
      uri += `&show=${encodeURIComponent(show)}`;

      fetch(uri).then(response => {
        if (response.ok) {
          response.json().then(data => {
            let message = '';

            if (data.message) {
              message = data.message;
            } else {
              const date = moment(new Date(data.updated_at)).fromNow();
              const status = [];
              let job = '';

              data.status.forEach(staff => {
                if (staff.status === 'finished') {
                  status.push(colors.green(staff.acronym));
                } else {
                  status.push(colors.red(staff.acronym));
                  if (!job) {
                    job = staff.position;
                  }
                }
              });

              message = `Ep ${data.episode} of ${data.name}`;
              message += ` is at ${job} as of ${date}. `;
              message += `[${status.join(' ')}]`;
            }

            resolve(message);
          });
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
      return 'finished';
    }

    return 'pending';
  }

  help(from, to) {
    this.client.send(to, `Help pending`);
  }
}
