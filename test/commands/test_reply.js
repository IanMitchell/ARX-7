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
      reply.message('Mocha', '#test', 'ping');
      assert.equal(client.lastMessage, 'pong');
    });

    it('should respond to `bot respond`', () => {
      reply.message('Mocha', '#test', 'bot respond');
      assert.equal(client.lastMessage, "I'm a pretty stupid bot.");
    });

    it('should respond to `bot be nice`', () => {
      reply.message('Mocha', '#test', 'bot be nice');
      assert.equal(client.lastMessage, 'sorry :(');
    });

    it('should respond to `gj bot`', () => {
      reply.message('Mocha', '#test', 'gj bot');
      assert.equal(client.lastMessage, 'thx');
    });

    it('should respond to `thx bot`', () => {
      reply.message('Mocha', '#test', 'thx bot');
      assert.equal(client.lastMessage, 'np');
    });

    it('should respond to `bot pls`', () => {
      reply.message('Mocha', '#test', 'bot pls');
      assert.equal(client.lastMessage, '( ¬‿¬)');
    });

    it('should not respond to invalid triggers', () => {
      reply.message('Mocha', '#test', 'Hi Desch');
      assert.equal(client.lastMessage, null);
    });

    it('should respond to `.bugreport`', () => {
      reply.message('Mocha', '#test', '.bugreport');
      assert.equal(client.lastMessage, 'Hi! To file a feature request or bug, go to: https://github.com/IanMitchell/ARX-7');
    });
  });

  describe('General', () => {
    it('should respond in correct channel', () => {
      reply.message('Mocha', '#test', 'bot pls');
      assert.equal(client.lastTarget, '#test');
    });
  });
});
