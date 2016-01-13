import 'babel-polyfill';
import { describe, afterEach, it } from 'mocha';
import assert from 'assert';
import { Client } from '../helpers.js';
import { Reply } from '../../src/commands/reply';

const client = new Client();
const reply = new Reply(client);

describe('Reply', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should respond to `ping`', () => {
      return reply.message('Mocha', '#test', 'ping').then(() => {
        assert.equal(client.lastMessage, 'pong');
      });
    });

    it('should respond to `bot respond`', () => {
      return reply.message('Mocha', '#test', 'bot respond').then(() => {
        assert.equal(client.lastMessage, "I'm a pretty stupid bot.");
      });
    });

    it('should respond to `bot be nice`', () => {
      return reply.message('Mocha', '#test', 'bot be nice').then(() => {
        assert.equal(client.lastMessage, 'sorry :(');
      });
    });

    it('should respond to `gj bot`', () => {
      return reply.message('Mocha', '#test', 'gj bot').then(() => {
        assert.equal(client.lastMessage, 'thx');
      });
    });

    it('should respond to `thx bot`', () => {
      return reply.message('Mocha', '#test', 'thx bot').then(() => {
        assert.equal(client.lastMessage, 'np');
      });
    });

    it('should respond to `bot pls`', () => {
      return reply.message('Mocha', '#test', 'bot pls').then(() => {
        assert.equal(client.lastMessage, '( ¬‿¬)');
      });
    });

    it('should respond to `!bugreport`', () => {
      return reply.message('Mocha', '#test', '!bugreport').then(() => {
        assert.equal(client.lastMessage, 'Hi! To file a feature request or bug, go to: https://github.com/IanMitchell/ARX-7');
      });
    });

    it('should not respond to invalid triggers', () => {
      return reply.message('Mocha', '#test', 'Hi Desch').then(() => {
        assert.equal(client.lastMessage, null);
      });
    });
  });

  describe('General', () => {
    it('should respond in correct channel', () => {
      return reply.message('Mocha', '#test', 'bot pls').then(() => {
        assert.equal(client.lastTarget, '#test');
      });
    });
  });
});
