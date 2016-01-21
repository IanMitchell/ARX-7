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

  it('should not respond to invalid triggers', () => {
    reply.message('Mocha', '#test', 'Hi Desch');
    assert(!client.lastMessage);
  });

  describe('> ping', () => {
    it('should respond', () => {
      reply.message('Mocha', '#test', 'ping');
      assert.equal('pong', client.lastMessage);
    });

    it('should respond in correct channel', () => {
      reply.message('Mocha', '#test', 'ping');
      assert.equal('#test', client.lastTarget);
    });
  });

  describe('> bot respond', () => {
    it('should respond', () => {
      reply.message('Mocha', '#test', 'bot respond');
      assert.equal("I'm a pretty stupid bot.", client.lastMessage);
    });

    it('should respond in correct channel', () => {
      reply.message('Mocha', '#test', 'bot respond');
      assert.equal('#test', client.lastTarget);
    });
  });

  describe('> bot be nice', () => {
    it('should respond', () => {
      reply.message('Mocha', '#test', 'bot be nice');
      assert.equal('sorry :(', client.lastMessage);
    });

    it('should respond in correct channel', () => {
      reply.message('Mocha', '#test', 'bot be nice');
      assert.equal('#test', client.lastTarget);
    });
  });

  describe('> gj bot', () => {
    it('should respond', () => {
      reply.message('Mocha', '#test', 'gj bot');
      assert.equal('thx', client.lastMessage);
    });

    it('should respond in correct channel', () => {
      reply.message('Mocha', '#test', 'gj bot');
      assert.equal('#test', client.lastTarget);
    });
  });

  describe('> thx bot', () => {
    it('should respond', () => {
      reply.message('Mocha', '#test', 'thx bot');
      assert.equal('np', client.lastMessage);
    });

    it('should respond in correct channel', () => {
      reply.message('Mocha', '#test', 'thx bot');
      assert.equal('#test', client.lastTarget);
    });
  });

  describe('> bot pls', () => {
    it('should respond', () => {
      reply.message('Mocha', '#test', 'bot pls');
      assert.equal('( ¬‿¬)', client.lastMessage);
    });

    it('should respond in correct channel', () => {
      reply.message('Mocha', '#test', 'bot pls');
      assert.equal('#test', client.lastTarget);
    });
  });

  describe('> .bugreport', () => {
    it('should respond', () => {
      reply.message('Mocha', '#test', '.bugreport');
      assert.equal('Hi! To file a feature request or bug, go to: https://github.com/IanMitchell/ARX-7', client.lastMessage);
    });

    it('should respond in correct channel', () => {
      reply.message('Mocha', '#test', '.bugreport');
      assert.equal('#test', client.lastTarget);
    });
  });
});
