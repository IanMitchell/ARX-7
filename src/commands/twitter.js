import debug from 'debug';
import he from 'he';
import * as TwitterClient from 'twitter-node-client';
import config from './../../config';
import { Command } from './command.js';

const log = debug('Twitter');

export class Twitter extends Command {
  message(from, to, text) {
    // Respond to Twitter Links
    const tweetRegex = /.*(twitter\.com\/)([\w]+)(\/status\/)(\d*).*/;
    const match = text.match(tweetRegex);

    if (match) {
      return new Promise((resolve, reject) => {
        log(`${from} on: ${match[2]}/${match[4]}`);

        this.info(match[2], match[4]).then(tweet => {
          this.send(to, `[Twitter]: ${tweet.text} | By ${tweet.username} (@${match[2]})`);
          return resolve();
        }, error => {
          this.send(to, 'Sorry, could not find Twitter info.');
          return reject(error);
        });
      });
    }

    return new Promise(resolve => resolve());
  }

  info(username, tweetId) {
    const twitter = new TwitterClient.Twitter({
      'consumerKey': config.keys.twitter_consumer,
      'consumerSecret': config.keys.twitter_consumer_secret,
      'accessToken': config.keys.twitter_access_token,
      'accessTokenSecret': config.keys.twitter_access_token_secret,
    });

    return new Promise((resolve, reject) => {
      twitter.getTweet({ id: tweetId },
        error => {
          log(`Twitter Request Error: ${error}`);
          return reject(Error(`Twitter Request Error: ${error}`));
        },
        success => {
          try {
            const data = JSON.parse(success);

            return resolve({
              // Remove linebreaks
              text: he.decode(data.text.replace(/\r?\n|\r/g, ' ')),
              username: data.user.name,
            });
          } catch (exception) {
            log(`Twitter Response Error: ${exception}`);
            return reject(Error(`Twitter Response Error: ${exception}`));
          }
        }
      );
    });
  }

  help(from) {
    this.client.notice(from, `Twitter automatically reads tweets from pasted urls.`);
  }
}
