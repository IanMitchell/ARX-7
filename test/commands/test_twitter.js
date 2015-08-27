import assert from "assert";
import {Client} from "../helpers.js";
import {Twitter} from "../../src/commands/twitter";

let client = new Client();
let twitter = new Twitter(client);

let link = '';

describe('Twitter', () => {
  describe('Triggers', () => {
    it('should activate anywhere in phrase', () => {
      return twitter.message('Mocha', '#test', `Tweet ${link}!`).then(() => {
        assert(client.lastMessage);
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return twitter.message('Mocha', '#test', link).then(() => {
        assert.equal('#test', client.lastTarget);
      });
    });

    it('should include [Twitter]', () => {
      return twitter.message('Mocha', '#test', link).then(() => {
        assert(client.lastMessage.startsWith('[Twitter] '));
      });
    });
  });

  describe('Tweet Lookup', () => {
    it('should include username and Twitter handle', () => {
      return twitter.message('Mocha', '#test', link).then(() => {
        let tweet = client.lastMessage.toLowerCase();
        assert(tweet.contains('ian mitchell {@ianmitchell1)'));
      });
    });

    // TODO: Test multiple links (use Jukey Tweet)
    it('should expand links');

    // TODO: Translate &gt; to >
    it('should handle special characters');
  });
});
