import assert from "assert";
import {Client} from "../helpers.js";
import {Imgur} from "../../src/commands/imgur";

let client = new Client();
let imgur = new Imgur(client);

describe('Imgur', () => {
  describe('Picture Lookup', () => {
    it('should respond in correct channel', () => {
      imgur.message('Mocha', '#test', 'http://imgur.com/gallery/E5bGFZE', null);
      assert.equal('#test', client.lastTarget);
      client.resetLog();
    });

    it('should activate anywhere in phrase', () => {
      imgur.message('Mocha', '#test', 'check it http://imgur.com/gallery/E5bGFZE', null);
      assert.notEqual(null, client.lastMessage);
      client.resetLog();
    });

    it('should include [Imgur]', () => {
      imgur.message('Mocha', '#test', 'http://imgur.com/gallery/E5bGFZE', null);
      assert(client.lastMessage.startsWith('[YouTube] '));
      client.resetLog();
    });

    // TODO: Test title, no title
    it('should display correct title');

    it('should include view count');
  });
});
