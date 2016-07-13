import debug from 'debug';
import fetch from 'node-fetch';
import { Command } from './command.js';
import moment from 'moment';
import { exactDate } from '../modules/dates';

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
        this.send(to, error.message);
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
      const date = exactDate(moment(new Date(show.air_date)));
      message += `${show.name} #${show.episode_number} airs in ${date}, `;
    });

    return message.slice(0, -2);
  }

  help(from) {
    this.client.notice(from, `.airing; returns time until the next episode airs.`);
  }
}
