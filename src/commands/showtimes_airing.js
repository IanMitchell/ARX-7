import debug from 'debug';
import fetch from 'node-fetch';
import { Command } from './command.js';
import moment from 'moment';
import { exactDate } from '../modules/dates';
import { ShowtimesError } from '../modules/custom_errors';

const log = debug('Airing');

const SHOWTIMES = {
  SERVER: process.env.SHOWTIMES_SERVER,
};

export class ShowtimesAiring extends Command {
  message(from, to, text) {
    if (text === '.airing') {
      log(`Airing request by ${from} in ${to}`);

      return this.airingRequest(to).then(response => {
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

  airingRequest(channel) {
    const uri = `${SHOWTIMES.SERVER}/shows.json?irc=${encodeURIComponent(channel)}`;
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

    let message = 'Air dates: ';

    if (json.shows.length > 0) {
      json.shows.forEach(show => {
        const date = exactDate(moment(new Date(show.air_date)));
        message += `${show.name} #${show.episode_number} airs in ${date}, `;
      });

      return message.slice(0, -2);
    }

    return 'No more airing shows this season!';
  }

  help(from) {
    this.client.notice(from, `.airing; returns time until the next episode airs.`);
  }
}
