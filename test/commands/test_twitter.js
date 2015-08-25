import assert from "assert";
import {Client} from "../helpers.js";
import {Twitter} from "../../src/commands/twitter";

let client = new Client();
let twitter = new Twitter(client);

describe('Twitter', () => {
  describe('Tweet Lookup', () => {
    it('should respond in correct channel', () => {
      twitter.message('Mocha', '#test', 'TODO', null);
      assert.equal('#test', client.lastTarget);
      client.resetLog();
    });

    it('should activate anywhere in phrase', () => {
      twitter.message('Mocha', '#test', '.yt End Credits', null);
      assert.notEqual(null, client.lastMessage);
      client.resetLog();
    });

    it('should include [Twitter]', () => {
      twitter.message('Mocha', '#test', '.yt End Credits', null);
      assert(client.lastMessage.startsWith('[YouTube] '));
      client.resetLog();
    });

    // TODO: Test multiple links (use Jukey Tweet)
    it('should expand links');
  });
});
