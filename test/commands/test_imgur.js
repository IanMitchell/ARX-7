import 'babel-polyfill';
import { describe, afterEach, it } from 'mocha';
import assert from 'assert';
import { Client } from '../helpers.js';
import { Imgur } from '../../src/commands/imgur';

const client = new Client();
const imgur = new Imgur(client);

const link = 'http://imgur.com/gallery/E5bGFZE';
const title = "I heard it was Mecha Monday, so here's ARX-7 Arbalest.";

const malformed = 'http://imgur.com/gallery/0000000';

const standard = 'http://imgur.com/E5bGFZE';
const direct = 'http://i.imgur.com/E5bGFZE.jpg';
const silent = 'http://imgur.com/fg8c8dB';

describe('Imgur', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should activate anywhere in phrase with Gallery URL', () => {
      return imgur.message('Mocha', '#test0', `ARX-7 ${link}!`).then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should activate anywhere in phrase with Standard URL', () => {
      return imgur.message('Mocha', '#test', `ARX-7 ${standard}!`).then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should activate anywhere in phrase with Direct URL', () => {
      return imgur.message('Mocha', '#test4', `ARX-7 ${direct}!`).then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should log and handle malformed links', () => {
      return imgur.message('Mocha', '#test', `${malformed}`).catch(error => {
        assert(error instanceof Error, 'Incorrect Error returned');
        assert(error.message.startsWith('Imgur Info'), 'Incorrect Error message');
        assert.equal(client.lastMessage, 'Sorry, could not find Imgur info.');
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return imgur.message('Mocha', '#test', link).then(() => {
        assert.equal(client.lastTarget, '#test');
      });
    });

    it('should include [Imgur]', () => {
      return imgur.message('Mocha', '#test', link).then(() => {
        assert(client.lastMessage.startsWith('[Imgur] '), 'Message not properly tagged');
      });
    });
  });

  describe('Picture Lookup', () => {
    it('should be silent on low traffic images', () => {
      return imgur.message('Mocha', '#test', silent).then(() => {
        assert.equal(client.lastMessage, null);
      });
    });

    it('should display correct title', () => {
      return imgur.message('Mocha', '#test', link).then(() => {
        assert(client.lastMessage.includes(title), 'Message does not include title');
      });
    });

    it('should include view count', () => {
      return imgur.message('Mocha', '#test', link).then(() => {
        const views = client.lastMessage.split('Views: ')[1];
        assert((parseInt(views, 10) > 300), 'Message contains invalid view amount');
      });
    });
  });
});
