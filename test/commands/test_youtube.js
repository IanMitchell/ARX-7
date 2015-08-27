import assert from "assert";
import {Client} from "../helpers.js";
import {Youtube} from "../../src/commands/youtube";

let client = new Client();
let youtube = new Youtube(client);

let link = 'https://www.youtube.com/watch?v=JmwVZ-p9XOk';

describe('YouTube', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should respond to .yt trigger', () => {
      youtube.message('Mocha', '#test', '.yt FMP!').then(() => {
        assert(client.lastMessage);
      });
    });

    it('should respond to .youtube trigger', () => {
      youtube.message('Mocha', '#test', '.youtube FMP!').then(() => {
        assert(client.lastMessage);
      });
    });

    it("shouldn't respond to .youtub trigger", () => {
      youtube.message('Mocha', '#test', '.youtub FMP!').then(() => {
        assert.equal(null, client.lastMessage);
      });
    });

    it('should activate in beginning of phrase', () => {
      youtube.message('Mocha', '#test', '.yt FMP!').then(() => {
        assert.notEqual(null, client.lastMessage);
      });
    });

    it('should not activate in middle of phrase', () => {
      youtube.message('Mocha', '#test', 'test .yt FMP!').then(() => {
        assert.equal(null, client.lastMessage);
      });
    });

    it('should activate lookup anywhere in phrase', () => {
      youtube.message('Mocha', '#test', `Cool ${link} vid`).then(() => {
        assert(client.lastMessage);
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      youtube.message('Mocha', '#test2', '.yt End Credits').then(() => {
        assert.equal('#test', client.lastTarget);
      });
    });

    it('should include [YouTube]', () => {
      youtube.message('Mocha', '#test2', '.yt End Credits').then(() => {
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
