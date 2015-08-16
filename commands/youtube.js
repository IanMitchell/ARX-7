import request from 'request';
import config from './../config';
import {Command} from './command.js';

export class Youtube extends Command {
  message(from, to, text, message) {
    // Respond to Youtube Requests
    if (text.toLowerCase().startsWith('.youtube ') ||
        text.toLowerCase().startsWith('.ty')) {
      console.log('Youtube Message Received');
      // TODO: http://pastebin.com/nuaGJXf1
    }

    // Respond to Youtube Links
    let info_regex = /.*(youtube.com\/watch\S*v=|youtu.be\/)([\w-]+).*/;
    let match = text.match(info_regex);
    if (match) {
      this.info(match[2]).then(video => {
        this.client.say(to, `[YouTube] ${video.title} | Views: ${video.views}`);
      });
    }
  }

  addCommas(intNum) {
    return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }

  info(id) {
    let uri = `https://www.googleapis.com/youtube/v3/videos` +
              `?id=${id}&alt=json&key=${config.keys.youtube}` +
              `&fields=items(id,snippet(channelId,title),statistics)` +
              `&part=snippet,statistics`

    console.log(`Retrieving YouTube information for ${id}`);

    return new Promise((resolve, reject) => {
      request(uri, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body);
          let video = {
            title: data['items'][0]['snippet']['title'],
            views: this.addCommas(data['items'][0]['statistics']['viewCount'])
          }

          resolve(video);
        }
        else {
          console.log(`ERROR: YouTube Info - ${error}`);
          reject();
        }
      });
    });
  }

  search(message) {

  }
}
