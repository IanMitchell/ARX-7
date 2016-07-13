import debug from 'debug';
import he from 'he';
import TwitterClient from 'twitter';
import { Command } from './command.js';
import { ProtectedError } from '../modules/custom_errors';

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
        if (error instanceof ProtectedError) {
          this.send(to, error.message);
        } else {
          log(error);
          this.send(to, 'Sorry, could not find Twitter info.');
        }

        return error;
      });
    }

    // Needed for tests
    return new Promise(resolve => resolve());
  }

  info(username, tweetId) {
    const client = new TwitterClient({
      consumer_key: process.env.TWITTER_CONSUMER,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    return new Promise((resolve, reject) => {
      client.get('statuses/show/', { id: tweetId }, (error, tweet) => {
        if (error) {
          log(`Twitter Info Request Error: ${error}`);
          return reject(Error(`Twitter Info Request Error: ${error}`));
        }

        if (tweet.user.protected) {
          log('Protected tweet linked');
          return reject(new ProtectedError(`@${tweet.user.name} is a protected account.`));
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
