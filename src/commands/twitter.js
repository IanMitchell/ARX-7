import debug from 'debug';
import he from 'he';
import TwitterClient from 'twitter';
import config from './../../config';
import { Command } from './command.js';

const log = debug('Twitter');

export class Twitter extends Command {
  message(from, to, text) {
    // Respond to Twitter Links
    const tweetRegex = /.*(twitter\.com\/)([\w]+)(\/status\/)(\d*).*/;
    const match = text.match(tweetRegex);

    if (match) {
      log(`${from} on: ${match[2]}/${match[4]}`);

      return this.info(match[2], match[4]).then(tweet => {
        this.send(to, `[Twitter]: ${tweet.text} | By ${tweet.username} (@${match[2]})`);
      }, error => {
        this.send(to, 'Sorry, could not find Twitter info.');
        log(error);
        return error;
      });
    }

    // Needed for tests
    return new Promise(resolve => resolve());
  }

  info(username, tweetId) {
    const client = new TwitterClient({
      consumer_key: config.keys.twitter_consumer,
      consumer_secret: config.keys.twitter_consumer_secret,
      access_token_key: config.keys.twitter_access_token,
      access_token_secret: config.keys.twitter_access_token_secret,
    });

    return new Promise((resolve, reject) => {
      client.get('statuses/show/', { id: tweetId }, (error, tweet) => {
        if (error) {
          log(`Twitter Info Request Error: ${error}`);
          return reject(Error(`Twitter Info Request Error: ${error}`));
        }

        try {
          return resolve({
            // Remove linebreaks
            text: he.decode(tweet.text.replace(/\r?\n|\r/g, ' ')),
            username: tweet.user.name,
          });
        } catch (exception) {
          log(`Twitter Info Response Error: ${exception}`);
          return reject(Error(`Twitter Info Response Error: ${exception}`));
        }
      });
    });
  }

  help(from) {
    this.client.notice(from, `Twitter automatically reads tweets from pasted urls.`);
  }
}
