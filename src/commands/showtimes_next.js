import debug from 'debug';
import fetch from 'node-fetch';
import { Command } from './command.js';
import moment from 'moment';
import { exactDate } from '../modules/dates';
import { ShowtimesError } from '../modules/custom_errors';

const log = debug('Next');
const SHOWTIMES = {
  SERVER: process.env.SHOWTIMES_SERVER,
  KEY: process.env.SHOWTIMES_KEY,
};

export class ShowtimesNext extends Command {
  message(from, to, text) {
    const nextRegex = /^[.!](?:next)\s(.+)$/i;
    const next = text.match(nextRegex);

    if (next) {
      log(`Next request by ${from} for ${next[1]}`);

      return this.nextRequest(next[1]).then(response => {
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

    // Needed for tests
    return new Promise(resolve => resolve());
  }

  nextRequest(show) {
    const name = encodeURIComponent(show.trim());
    const uri = `${SHOWTIMES.SERVER}/shows/${name}.json`;

    return fetch(uri).then(response => {
      if (response.ok) {
        return response.json().then(data => this.createMessage(data));
      }

      return response.json().then(data => Promise.reject(new ShowtimesError(data.message)));
    }).catch(error => Promise.reject(error));
  }

  createMessage(json) {
    if (json.message) {
      return json.message;
    }

    if (json.air_date) {
      const date = exactDate(moment(new Date(json.air_date)));
      return `Air date: ${json.name} #${json.episode_number} airs in ${date}`;
    }

    return `${json.name} has finished airing!`;
  }

  help(from) {
    this.client.notice(from, `.next [show]; returns time until the next episode airs.`);
  }
}
