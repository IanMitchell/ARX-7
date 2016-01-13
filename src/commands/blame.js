import debug from 'debug';
import fetch from 'node-fetch';
import config from './../../config';
import { Command } from './command.js';
import colors from 'irc-colors';
import moment from 'moment';

const log = debug('Blame');
const SHOWTIMES_URL = `${config.showtimes.server}`;

export class Blame extends Command {
  message(from, to, text) {
    const blameRegex = /^[.!](?:show|blame)\s(.+)$/i;
    const blame = text.match(blameRegex);

    if (blame) {
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
    } else if (text.trim().toLowerCase() === '.blame') {
      this.send(to, 'Please use: ".blame <show>" (ie, `.blame bokumachi`)');
    }
  }

  blameRequest(from, to, show) {
    log(`Blame request by ${from} in ${to} for ${show}`);

    return new Promise((resolve, reject) => {
      let uri = `${SHOWTIMES_URL}/blame.json?`;
      uri += `irc=${encodeURIComponent(to)}`;
      uri += `&show=${encodeURIComponent(show.trim())}`;

      fetch(uri).then(response => {
        if (response.ok) {
          response.json().then(data => {
            let message = '';

            if (data.message) {
              message = data.message;
            } else {
              const updatedDate = moment(new Date(data.updated_at));
              const airDate = moment(new Date(data.air_date));
              const status = new Map();
              let job;

              data.status.forEach(staff => {
                if (staff.finished) {
                  // Pending takes precedence
                  if (!status.get(staff.acronym)) {
                    status.set(staff.acronym, colors.bold.green(staff.acronym));
                  }
                } else {
                  status.set(staff.acronym, colors.bold.red(staff.acronym));

                  if (!job) {
                    job = staff.position;
                  }
                }
              });

              if (job === undefined) {
                job = 'release';
              }

              message = `Ep ${data.episode} of ${data.name}`;

              if (updatedDate > airDate) {
                message += ` is at ${job} (last update ${updatedDate.fromNow()}). `;
              } else {
                message += ` will air in ${airDate.fromNow()}. `;
              }

              message += `[${[...status.values()].join(' ')}]`;
            }

            resolve(message);
          });
        } else {
          response.json().then(data => reject(Error(data.message)));
        }
      }).catch(error => reject(Error(error)));
    });
  }

  help(from) {
    this.client.notice(from, `.blame [show]; returns show information.`);
  }
}
