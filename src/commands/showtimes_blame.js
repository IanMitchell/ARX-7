import debug from 'debug';
import fetch from 'node-fetch';
import config from './../../config';
import { Command } from './command.js';
import colors from 'irc-colors';
import moment from 'moment';

const log = debug('Blame');

export class ShowtimesBlame extends Command {
  message(from, to, text) {
    const blameRegex = /^[.!](?:show|blame)\s(.+)$/i;
    const blame = text.match(blameRegex);

    if (blame) {
      return this.blameRequest(from, to, blame[1]).then(response => {
        this.send(to, response);
      }, error => {
        this.send(to, error.message);
        log(`Error: ${error.message}`);
        return error;
      });
    } else if (text.trim().toLowerCase() === '.blame') {
      this.send(to, 'Please use: ".blame <show>" (ie, `.blame bokumachi`)');
    }

    // Needed for tests
    return new Promise(resolve => resolve());
  }

  blameRequest(from, to, show, useNames = false) {
    log(`Blame request by ${from} in ${to} for ${show}`);

    let uri = `${config.showtimes.server}/blame.json?`;
    uri += `irc=${encodeURIComponent(to)}`;
    uri += `&show=${encodeURIComponent(show.trim())}`;

    return fetch(uri).then(response => {
      if (response.ok) {
        return response.json().then(data => this.createMessage(data, useNames));
      }

      return response.json().then(data => {
        log(`Blame Request Error: ${data}`);
        Error(data.message);
      });
    }).catch(error => Error(error));
  }

  createMessage(json, useNames) {
    if (json.message) {
      return json.message;
    }

    const updatedDate = moment(new Date(json.updated_at));
    const airDate = moment(new Date(json.air_date));
    const status = new Map();
    let job = 'release';

    let message = `Ep ${json.episode} of ${json.name}`;

    json.status.forEach(staff => {
      // Pending takes precedence
      if (staff.finished && !status.has(staff.acronym)) {
        status.set(staff.acronym, colors.bold.green(staff.acronym));
      } else if (!staff.finished) {
        status.set(staff.acronym, colors.bold.red(staff.acronym));

        if (job === 'release') {
          job = useNames ? staff.staff : staff.position;
        }
      }
    });

    if (updatedDate > airDate) {
      message += ` is at ${job} (last update ${updatedDate.fromNow()}). `;
    } else {
      message += airDate > Date.now() ? ' airs' : ' aired';
      message += ` ${airDate.fromNow()}. `;
    }

    message += `[${[...status.values()].join(' ')}]`;

    return message;
  }

  help(from) {
    this.client.notice(from, `.blame [show]; returns show information.`);
  }
}
