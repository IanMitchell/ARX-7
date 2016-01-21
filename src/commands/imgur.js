import debug from 'debug';
import fetch from 'node-fetch';
import config from './../../config';
import { Command } from './command.js';

const log = debug('Imgur');
const IMGUR_VIEW_LIMIT = 20;

export class Imgur extends Command {
  message(from, to, text) {
    // Respond to Imgur Links
    const imgurRegex = /.*(imgur\.com\/(gallery\/)?)([\w]+)/;
    const match = text.match(imgurRegex);

    if (match) {
      log(`Retrieving information for ${match[3]}`);

      return this.info(match[3]).then(imgur => {
        if (imgur.title !== 'Untitled' && imgur.views > IMGUR_VIEW_LIMIT) {
          this.send(to, `[Imgur] ${imgur.title} | Views: ${imgur.views}`);
        }
      }, error => {
        this.send(to, 'Sorry, could not find Imgur info.');
        log(error);
        return error;
      });
    }
  }

  info(id) {
    const url = `https://api.imgur.com/3/image/${id}`;
    const headers = new fetch.Headers();
    headers.append('Authorization', `Client-ID ${config.keys.imgur_client}`);

    return fetch(url, { headers }).then(response => {
      if (response.ok) {
        return response.json().then(data => this.parseJSON(data));
      }

      // Error State
      return response.json().then(data => {
        log(`Imgur Info Request Error: ${data}`);
        return Error(`Imgur Info Request Error: ${data}`);
      });
    }).catch(error => Error(error));
  }

  parseJSON(data) {
    try {
      const imgur = {
        title: data.data.title || 'Untitled',
        views: this.addCommas(data.data.views),
      };

      return imgur;
    } catch (exception) {
      log(`Imgur Info Response Error: ${exception}`);
      return Error(`Imgur Info Response Error: ${exception}`);
    }
  }

  addCommas(intNum) {
    return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }

  help(from) {
    this.client.notice(from, `Imgur automatically reads image metadata from pasted urls.`);
  }
}
