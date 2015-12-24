import debug from 'debug';
import request from 'request';
import config from './../../config';
import { Command } from './command.js';

const log = debug('YouTube');

export class Youtube extends Command {
  message(from, to, text) {
    // Respond to Youtube Requests
    const search = text.match(/^\.(yt\s|youtube\s)(.*)$/i, '$2');

    if (search) {
      return new Promise((resolve, reject) => {
        log(`${from} on: ${search[2]}`);

        this.search(search[2]).then(video => {
          this.send(to, `[YouTube] ${video.title} | ${video.url}`);
          return resolve();
        }, error => {
          this.send(to, 'Sorry, could not find a video.');
          return reject(error);
        });
      });
    }

    // Respond to Youtube Links
    const infoRegex = /.*(youtube\.com\/watch\S*v=|youtu\.be\/)([\w-]+).*/;
    const match = text.match(infoRegex);

    if (match) {
      return new Promise((resolve, reject) => {
        log(`${from} on: ${match[2]}`);

        this.info(match[2]).then(video => {
          this.send(to, `[YouTube] ${video.title} | Views: ${video.views}`);
          return resolve();
        }, error => {
          this.send(to, 'Sorry, could not find YouTube info.');
          return reject(error);
        });
      });
    }

    return new Promise(resolve => resolve());
  }

  addCommas(intNum) {
    return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }

  info(id) {
    const uri = `https://www.googleapis.com/youtube/v3/videos` +
                `?id=${id}&alt=json&key=${config.keys.youtube}` +
                `&fields=items(id,snippet(channelId,title),statistics)` +
                `&part=snippet,statistics`;

    return new Promise((resolve, reject) => {
      request(uri, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          try {
            const data = JSON.parse(body);
            const video = {
              title: data.items[0].snippet.title,
              views: this.addCommas(data.items[0].statistics.viewCount),
            };

            return resolve(video);
          } catch (exception) {
            log(`YouTube Info Response Error: ${exception}`);
            return reject(Error(`YouTube Info Response Error: ${exception}`));
          }
        } else {
          log(`YouTube Info Request Error: ${error}`);
          return reject(Error(`YouTube Info Request Error: ${error}`));
        }
      });
    });
  }

  search(title) {
    const uri = `https://www.googleapis.com/youtube/v3/search?part=snippet` +
                `&q=${encodeURIComponent(title.trim())}` +
                `&key=${config.keys.youtube}`;

    return new Promise((resolve, reject) => {
      request(uri, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          try {
            const data = JSON.parse(body);

            data.items.forEach(val => {
              if (val.id.kind !== 'youtube#video') {
                return;
              }

              resolve({
                title: val.snippet.title,
                url: `https://youtu.be/${val.id.videoId}`,
              });
            });
          } catch (exception) {
            log(`YouTube Search Response Error: ${exception}`);
            return reject(Error(`YouTube Search Response Error: ${exception}`));
          }
        } else {
          log(`YouTube Search Request Error: ${error}`);
          return reject(Error(`YouTube Search Request Error: ${error}`));
        }
      });
    });
  }
}
