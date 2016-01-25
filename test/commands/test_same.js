import 'babel-polyfill';
import { describe, afterEach, it } from 'mocha';
import assert from 'assert';
import { Client } from '../helpers.js';
import { Same, MESSAGE_STACK_SIZE } from '../../src/commands/same';

const client = new Client();
const same = new Same(client);

describe('Same', () => {
  afterEach(() => {
    client.resetLog();
    same.messageStack = new Map();
  });

  describe('Triggers', () => {
    it('should track different channels', () => {
      same.message('Mocha', '#test', 'same');
      same.message('Mocha', '#test2', 'same');
      assert.equal(same.messageStack.size, 2);
      assert.equal(same.messageStack.get('#test')[0], 'same');
    });

    it('should not track more than specified amount', () => {
      for (let i = 0; i < MESSAGE_STACK_SIZE - 1; i++) {
        same.message('Mocha', '#test', 'same');
        assert.equal(same.messageStack.get('#test').length, i + 1);
      }

      same.message('Mocha', '#test', 'same');
      assert.equal(same.messageStack.get('#test').length, 0);
    });
  });

  describe('General Usage', () => {
    it('should not respond early', () => {
      for (let i = 0; i < MESSAGE_STACK_SIZE - 1; i++) {
        same.message('Mocha', '#test', 'same');
        assert.equal(client.lastMessage, null);
      }
    });

    it('should respond with correct phrase', () => {
      for (let i = 0; i <= MESSAGE_STACK_SIZE; i++) {
        same.message('Mocha', '#test', 'same');
      }

      assert.equal(client.lastMessage, 'same');
    });
  });
});
