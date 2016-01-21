import 'babel-polyfill';
import { describe, afterEach, it } from 'mocha';
import assert from 'assert';
import { Client } from '../helpers.js';
import { Youtube } from '../../src/commands/youtube';

const client = new Client();
const youtube = new Youtube(client);

const link = 'https://www.youtube.com/watch?v=JmwVZ-p9XOk';
const malformed = 'youtube.com/watch?v=8WZr6f…';

describe('YouTube', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should respond to .yt trigger', () => {
      return youtube.message('Mocha', '#test', '.yt FMP!').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should respond to .youtube trigger', () => {
      return youtube.message('Mocha', '#test', '.youtube FMP!').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should not respond to .youtub trigger', () => {
      return youtube.message('Mocha', '#test', '.youtub FMP!').then(() => {
        assert.equal(client.lastMessage, null);
      });
    });

    it('should activate in beginning of phrase', () => {
      return youtube.message('Mocha', '#test', '.yt FMP!').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should not activate in middle of phrase', () => {
      return youtube.message('Mocha', '#test', 'test .yt FMP!').then(() => {
        assert.equal(client.lastMessage, null);
      });
    });

    it('should activate lookup anywhere in phrase', () => {
      return youtube.message('Mocha', '#test', `Cool ${link} vid`).then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should be case insensitive', () => {
      return youtube.message('Mocha', '#test', '.YT A').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should log and handle malformed links', () => {
      return youtube.message('Mocha', '#test', `${malformed}`).catch(error => {
        assert(error instanceof Error, 'Incorrect Error returned');
        assert(error.message.startsWith('YouTube Info'), 'Incorrect Error message');
        assert.equal(client.lastMessage, 'Sorry, could not find YouTube info.');
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return youtube.message('Mocha', '#test', '.yt End Credits').then(() => {
        assert.equal(client.lastTarget, '#test');
      });
    });

    it('should include [YouTube]', () => {
      return youtube.message('Mocha', '#test2', '.yt End Credits').then(() => {
        assert(client.lastMessage.startsWith('[YouTube] '), 'Message not properly tagged');
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
