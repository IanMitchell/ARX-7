import debug from 'debug';
import fetch from 'node-fetch';
import config from './../../config';
import { Command } from './command.js';
import moment from 'moment';

const log = debug('Airing');

export class ShowtimesAiring extends Command {
  message(from, to, text) {
    if (text === '.airing') {
      log(`Airing request by ${from} in ${to}`);

      return this.airingRequest().then(response => {
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

  airingRequest() {
    return fetch(`${config.showtimes.server}/shows.json`).then(response => {
      if (response.ok) {
        return response.json().then(data => this.createMessage(data));
      }

      return response.json().then(data => {
        log(`Airing Request Error: ${data}`);
        Error(data.message);
      });
    }).catch(error => Error(error));
  }

  createMessage(json) {
    if (json.message) {
      return json.message;
    }

    let message = 'Air dates: ';

    json.shows.forEach(show => {
      const date = moment(new Date(show.air_date)).fromNow();
      message += `${show.alias} #${show.episode_number} airs in ${date}, `;
    });

    return message.slice(0, -2);
  }

  help(from) {
    this.client.notice(from, `.airing; returns time until the next episode airs.`);
  }
}
