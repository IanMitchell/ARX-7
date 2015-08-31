import assert from "assert";
import {Client} from "../helpers.js";
import {Youtube} from "../../src/commands/youtube";

let client = new Client();
let youtube = new Youtube(client);

let link = 'https://www.youtube.com/watch?v=JmwVZ-p9XOk';
let malformed = 'youtube.com/watch?v=8WZr6f…';

describe('YouTube', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should respond to .yt trigger', () => {
      return youtube.message('Mocha', '#test', '.yt FMP!').then(() => {
        assert(client.lastMessage);
      });
    });

    it('should respond to .youtube trigger', () => {
      return youtube.message('Mocha', '#test', '.youtube FMP!').then(() => {
        assert(client.lastMessage);
      });
    });

    it('should not respond to .youtub trigger', () => {
      return youtube.message('Mocha', '#test', '.youtub FMP!').then(() => {
        assert.equal(null, client.lastMessage);
      });
    });

    it('should activate in beginning of phrase', () => {
      return youtube.message('Mocha', '#test', '.yt FMP!').then(() => {
        assert.notEqual(null, client.lastMessage);
      });
    });

    it('should not activate in middle of phrase', () => {
      return youtube.message('Mocha', '#test', 'test .yt FMP!').then(() => {
        assert.equal(null, client.lastMessage);
      });
    });

    it('should activate lookup anywhere in phrase', () => {
      return youtube.message('Mocha', '#test', `Cool ${link} vid`).then(() => {
        assert(client.lastMessage);
      });
    });

    it('should log and handle malformed links', () => {
      return assert.throws(
        youtube.message('Mocha', '#test', `${malformed}`).then(() => {
          assert.equal('Sorry, could not find YouTube info.', client.lastMessage);
        }), Error);
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return youtube.message('Mocha', '#test', '.yt End Credits').then(() => {
        assert.equal('#test', client.lastTarget);
      });
    });

    it('should include [YouTube]', () => {
      return youtube.message('Mocha', '#test2', '.yt End Credits').then(() => {
        assert(client.lastMessage.startsWith('[YouTube] '));
      });
    });
  });

  describe('Video Search', () => {
    it('should return a link');
  });

  describe('Video Lookup', () => {
    it('should respond to shortened links');

    it('should include view count');
  });
});
