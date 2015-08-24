import debug from 'debug';
import request from 'request';
import config from './../../config';
import {Command} from './command.js';

let log = debug('Imgur');

export class Imgur extends Command {
  message(from, to, text, message) {
    // Respond to Imgur Links
    let imgur_regex = /.*(imgur\.com\/(gallery\/)?)([\w]+)/;
    let match = text.match(imgur_regex);

    if (match) {
      this.info(match[3]).then(imgur => {
        this.send(to, `[Imgur] ${imgur.title} | Views: ${imgur.views}`);
      }, (error) => this.send(to, 'Sorry, coud not find imgur info.'));
    }
  }

  info(id) {
    log(`Retrieving Imgur information for ${id}`);

    let options = {
      url: `https://api.imgur.com/3/image/${id}`,
      headers: {
        'Authorization': `Client-ID ${config.keys.imgur_client}`
      }
    }

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body);
          let imgur = {
            title: data['data']['title'] || 'Untitled',
            views: this.addCommas(data['data']['views']),
          }

          resolve(imgur);
        }
        else {
          log(`ERROR: Imgur Info - ${error}`);
          reject();
        }
      });
    });
  }

  addCommas(intNum) {
    return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
}
