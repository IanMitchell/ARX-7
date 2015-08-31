import debug from 'debug';
import request from 'request';
import config from './../../config';
import {Command} from './command.js';

let log = debug('YouTube');

export class Youtube extends Command {
  message(from, to, text, message) {
    // Respond to Youtube Requests
    let search = text.match(/^\.(yt\s|youtube\s)(.*)$/, '$2');
    if (search) {
      return new Promise((resolve, reject) => {
        log(`${from} on: ${search[2]}`);

        this.search(search[2]).then(video => {
          this.send(to, `[YouTube] ${video.title} | ${video.url}`);
          resolve();
        }, error => {
          this.send(to, 'Sorry, could not find a video.');
          reject(error);
        });
      });
    }

    // Respond to Youtube Links
    let info_regex = /.*(youtube\.com\/watch\S*v=|youtu\.be\/)([\w-]+).*/;
    let match = text.match(info_regex);
    if (match) {
      return new Promise((resolve, reject) => {
        log(`${from} on: ${match[2]}`);

        this.info(match[2]).then(video => {
          this.send(to, `[YouTube] ${video.title} | Views: ${video.views}`);
          resolve();
        }, error => {
          this.send(to, 'Sorry, coud not find YouTube info.');
          reject(error);
        });
      });
    }

    return new Promise((resolve, reject) => resolve());
  }

  addCommas(intNum) {
    return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }

  info(id) {
    let uri = `https://www.googleapis.com/youtube/v3/videos` +
              `?id=${id}&alt=json&key=${config.keys.youtube}` +
              `&fields=items(id,snippet(channelId,title),statistics)` +
              `&part=snippet,statistics`

    return new Promise((resolve, reject) => {
      request(uri, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          try {
            let data = JSON.parse(body);
            let video = {
              title: data['items'][0]['snippet']['title'],
              views: this.addCommas(data['items'][0]['statistics']['viewCount'])
            };

            resolve(video);
          }
          catch(e) {
            log(`YouTube Info Response Error: ${e}`);
            reject(Error(`YouTube Info Response Error: ${e}`));
          }
        }
        else {
          log(`YouTube Info Request Error: ${error}`);
          reject(Error(`YouTube Info Request Error: ${error}`));
        }
      });
    });
  }

  search(title) {
    let uri = `https://www.googleapis.com/youtube/v3/search?part=snippet` +
              `&q=${encodeURIComponent(title.trim())}&key=${config.keys.youtube}`;

    return new Promise((resolve, reject) => {
      request(uri, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          try {
            let data = JSON.parse(body);

            data['items'].forEach(v => {
              if (v['id']['kind'] != 'youtube#video') {
                return;
              }

              resolve({
                title: v['snippet']['title'],
                url: `https://youtu.be/${v['id']['videoId']}`
              });
            });
          }
          catch(e) {
            log(`YouTube Search Response Error: ${e}`);
            reject(Error(`YouTube Search Response Error: ${e}`));
          }
        }
        else {
          log(`YouTube Search Request Error: ${error}`);
          reject(Error(`YouTube Search Request Error: ${error}`));
        }
      });
    });
  }
}
