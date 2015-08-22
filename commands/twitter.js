import * as TwitterClient from 'twitter-node-client';
import config from './../config';
import {Command} from './command.js';

export class Twitter extends Command {
  message(from, to, text, message) {
    // Respond to Twitter Links
    let tweet_regex = /.*(twitter\.com\/)([\w]+)(\/status\/)(\d*).*/;
    let match = text.match(tweet_regex);

    if (match) {
      this.info(match[2], match[4]).then(tweet => {
        this.send(to, `[Twitter]: ${tweet.text} | By ${tweet.username} (@${match[2]})`);
      }, (error) => this.send(to, 'Sorry, coud not find tweet info.'));
    }
  }

  info(username, tweet_id) {
    console.log(`Retrieving Twitter information for ${username}/${tweet_id}`);

    let twitter = new TwitterClient.Twitter({
      "consumerKey": config.keys.twitter_consumer,
      "consumerSecret": config.keys.twitter_consumer_secret,
      "accessToken": config.keys.twitter_access_token,
      "accessTokenSecret": config.keys.twitter_access_token_secret,
    });

    return new Promise((resolve, reject) => {
      twitter.getTweet({id: tweet_id},
        (error) => {
          console.log(`ERROR: Twitter Info - ${error}`);
          reject();
        },
        (success) => {
          let data = JSON.parse(success);

          resolve({
            // Remove linebreaks
            text: data.text.replace(/\r?\n|\r/g, ' '),
            username: data.user.name
          });
        }
      );
    });
  }
}
