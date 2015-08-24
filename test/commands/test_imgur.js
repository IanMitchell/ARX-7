import assert from "assert";
import {Client} from "../helpers.js";
import {Imgur} from "../../src/commands/imgur";

let client = new Client();
let imgur = new Imgur(client);

let link = 'http://imgur.com/gallery/E5bGFZE';
let title = "I heard it was Mecha Monday, so here's ARX-7 Arbalest.";

let standard = 'http://imgur.com/E5bGFZE';
let direct = 'http://i.imgur.com/E5bGFZE.jpg';

describe('Imgur', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should activate anywhere in phrase with Gallery URL 1', () => {
      return imgur.message('Mocha', '#test0', `ARX-7 ${link}!`).then(() => {
        assert(client.lastMessage);
      });
    });

    it('should activate anywhere in phrase with Standard URL', () => {
      return imgur.message('Mocha', '#test', `ARX-7 ${standard}!`).then(() => {
        assert(client.lastMessage);
      });
    });

    it('should activate anywhere in phrase with Direct URL', () => {
      return imgur.message('Mocha', '#test4', `ARX-7 ${direct}!`).then(() => {
        assert(client.lastMessage);
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return imgur.message('Mocha', '#test', link).then(() => {
        assert.equal('#test', client.lastTarget);
      });
    });

    it('should include [Imgur]', () => {
      return imgur.message('Mocha', '#test', link).then(() => {
        assert(client.lastMessage.startsWith('[Imgur] '));
      });
    });
  });

  describe('Picture Lookup', () => {
    // TODO: Test no title

    it('should display correct title', () => {
      return imgur.message('Mocha', '#test', link).then(() => {
        assert(client.lastMessage.includes(title));
      });
    });

    it('should include view count');
  });
});
