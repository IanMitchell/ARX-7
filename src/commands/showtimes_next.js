import debug from 'debug';
import fetch from 'node-fetch';
import { Command } from './command.js';
import moment from 'moment';

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
        this.send(to, error.message);
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

      return response.json().then(data => {
        log(`Next Request Error: ${data}`);
        Error(data.message);
      });
    }).catch(error => Error(error));
  }

  createMessage(json) {
    if (json.message) {
      return json.message;
    }

    const date = moment(new Date(json.air_date)).fromNow();
    return `Air date: ${json.alias} #${json.episode_number} airs ${date}`;
  }

  help(from) {
    this.client.notice(from, `.next [show]; returns time until the next episode airs.`);
  }
}
