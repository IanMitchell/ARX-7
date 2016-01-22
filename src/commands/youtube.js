import debug from 'debug';
import fetch from 'node-fetch';
import config from './../../config';
import { Command } from './command.js';
import { addCommas } from '../modules/number_helpers.js';

const log = debug('YouTube');

export class Youtube extends Command {
  message(from, to, text) {
    // Respond to Youtube Requests
    const search = text.match(/^\.(yt\s|youtube\s)(.*)$/i, '$2');

    if (search) {
      log(`${from} on: ${search[2]}`);

      return this.search(search[2]).then(video => {
        this.send(to, `[YouTube] ${video.title} | ${video.url}`);
      }, error => {
        this.send(to, 'Sorry, could not find a video.');
        log(error);
        return error;
      });
    }

    // Respond to Youtube Links
    const infoRegex = /.*(youtube\.com\/watch\S*v=|youtu\.be\/)([\w-]+).*/;
    const match = text.match(infoRegex);

    if (match) {
      log(`${from} on: ${match[2]}`);

      return this.info(match[2]).then(video => {
        this.send(to, `[YouTube] ${video.title} | Views: ${video.views}, Time: ${video.time}`);
      }, error => {
        this.send(to, 'Sorry, could not find YouTube info.');
        log(error);
        return error;
      });
    }

    // Needed for tests
    return new Promise(resolve => resolve());
  }

  info(id) {
    const uri = `https://www.googleapis.com/youtube/v3/videos` +
                `?id=${id}&alt=json&key=${config.keys.youtube}` +
                `&fields=items(id,snippet(channelId,title),contentDetails,statistics)` +
                `&part=snippet,statistics,contentDetails`;

    return fetch(uri).then(response => {
      if (response.ok) {
        return response.json().then(data => {
          try {
            if (data.items.length === 0) {
              log(`No information found for ${id}`);
              return Error(`YouTube Info Empty Item Response`);
            }

            const video = {
              title: data.items[0].snippet.title,
              // time: moment.duration(data.items[0].contentDetails.duration),
              views: addCommas(data.items[0].statistics.viewCount),
            };

            return video;
          } catch (exception) {
            log(`YouTube Info Response Error: ${exception}`);
            return Error(`YouTube Info Response Error: ${exception}`);
          }
        });
      }

      return response.json().then(data => {
        log(`YouTube Info Request Error: ${data}`);
        return Error(`YouTube Info Request Error: ${data}`);
      });
    }).catch(error => {
      return Error(error);
    });
  }

  search(title) {
    const uri = `https://www.googleapis.com/youtube/v3/search?part=snippet` +
                `&q=${encodeURIComponent(title.trim())}` +
                `&key=${config.keys.youtube}`;

    return fetch(uri).then(response => {
      if (response.ok) {
        return response.json().then(data => {
          try {
            for (let i = 0; i < data.items.length; i++) {
              if (data.items[i].id.kind !== 'youtube#video') {
                return false;
              }

              const video = {
                title: data.items[i].snippet.title,
                url: `https://youtu.be/${data.items[i].id.videoId}`,
              };

              return video;
            }
          } catch (exception) {
            log(`YouTube Search Response Error: ${exception}`);
            return Error(`YouTube Search Response Error: ${exception}`);
          }
        });
      }

      return response.json().then(data => {
        log(`YouTube Search Request Error: ${data}`);
        return Error(`YouTube Search Request Error: ${data}`);
      });
    }).catch(error => {
      return Error(error);
    });
  }

  help(from) {
    this.client.notice(from, `.yt [phrase]; returns video. YouTube also automatically reads metadata from pasted urls.`);
  }
}
