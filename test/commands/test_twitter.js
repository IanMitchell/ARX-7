import assert from "assert";
import {Client} from "../helpers.js";
import {Twitter} from "../../src/commands/twitter";

let client = new Client();
let twitter = new Twitter(client);

let link = 'https://twitter.com/IanMitchel1/status/636939838512500736';

describe('Twitter', () => {
  describe('Triggers', () => {
    it('should activate anywhere in phrase', () => {
      twitter.message('Mocha', '#test', `Tweet ${link}!`).then(() => {
        assert(client.lastMessage);
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      twitter.message('Mocha', '#test', link).then(() => {
        assert.equal('#test', client.lastTarget);
      });
    });

    it('should include [Twitter]', () => {
      twitter.message('Mocha', '#test', link).then(() => {
        assert(client.lastMessage.startsWith('[Twitter]: '));
      });
    });
  });

  describe('Tweet Lookup', () => {
    it('should include username and Twitter handle', () => {
      twitter.message('Mocha', '#test', link).then(() => {
        let tweet = client.lastMessage.toLowerCase();
        let expected = ' | By Ian Mitchell (@IanMitchel1)'.toLowerCase();
        assert(tweet.includes(expected));
      });
    });

    // TODO: Test multiple links (use Jukey Tweet)
    it('should expand links');

    // TODO: Translate &gt; to >
    it('should handle special characters');
  });
});
