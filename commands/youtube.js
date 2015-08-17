import request from 'request';
import config from './../config';
import {Command} from './command.js';

export class Youtube extends Command {
  message(from, to, text, message) {
    // Respond to Youtube Requests
    let search = text.match(/.(yt\s|youtube\s)(.*)/, '$2');
    if (search) {
      this.search(search[2]).then(video => {
        this.client.say(to, `[YouTube] ${video.title} | ${video.url}`);
      }, (error) => this.client.say(to, 'Sorry, could not find a video.'));
    }

    // Respond to Youtube Links
    let info_regex = /.*(youtube\.com\/watch\S*v=|youtu\.be\/)([\w-]+).*/;
    let match = text.match(info_regex);
    if (match) {
      this.info(match[2]).then(video => {
        this.client.say(to, `[YouTube] ${video.title} | Views: ${video.views}`);
      }, (error) => this.client.say(to, 'Sorry, coud not find video info.'));
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

  search(title) {
    let uri = `https://www.googleapis.com/youtube/v3/search?part=snippet` +
              `&q=${title}&key=${config.keys.youtube}`;

    console.log(`Searching YouTube for ${title}`);

    return new Promise((resolve, reject) => {
      request(uri, (error, response, body) => {
        if (!error && response.statusCode == 200) {
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

          reject();
        }
        else {
          console.log(`ERROR: YouTube Search - ${error}`);
          reject();
        }
      });
    });
  }
}
