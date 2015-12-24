import debug from 'debug';
import request from 'request';
import config from './../../config';
import { Command } from './command.js';

const log = debug('Imgur');

export class Imgur extends Command {
  message(from, to, text) {
    // Respond to Imgur Links
    const imgurRegex = /.*(imgur\.com\/(gallery\/)?)([\w]+)/;
    const match = text.match(imgurRegex);

    if (match) {
      return new Promise((resolve, reject) => {
        log(`Retrieving information for ${match[3]}`);

        this.info(match[3]).then(imgur => {
          this.send(to, `[Imgur] ${imgur.title} | Views: ${imgur.views}`);
          return resolve();
        }, error => {
          this.send(to, 'Sorry, could not find Imgur info.');
          return reject(error);
        });
      });
    }

    return new Promise(resolve => resolve());
  }

  info(id) {
    const options = {
      url: `https://api.imgur.com/3/image/${id}`,
      headers: {
        'Authorization': `Client-ID ${config.keys.imgur_client}`,
      },
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          try {
            const data = JSON.parse(body);
            const imgur = {
              title: data.data.title || 'Untitled',
              views: this.addCommas(data.data.views),
            };

            return resolve(imgur);
          } catch (exception) {
            log(`Imgur Response Error: ${exception}`);
            return reject(Error(`Imgur Response Error: ${exception}`));
          }
        } else {
          log(`Imgur Request Error: ${error}`);
          return reject(Error(`Imgur Request Error: ${error}`));
        }
      });
    });
  }

  addCommas(intNum) {
    return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }

  help(from, to) {
    this.send(to, `Imgur automatically reads image metadata from pasted urls.`);
  }
}
