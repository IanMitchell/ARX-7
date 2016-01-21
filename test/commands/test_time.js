import 'babel-polyfill';
import { describe, afterEach, it } from 'mocha';
import assert from 'assert';
import { Client } from '../helpers.js';
import { Time } from '../../src/commands/time';

const client = new Client();
const time = new Time(client);

// I hate everything about this
function getJST() {
  const jstOffset = 1000 * 60 * 60 * 9;
  const localOffset = (new Date()).getTimezoneOffset() * 1000 * 60;

  const jst = new Date((new Date()).getTime() + localOffset + jstOffset);

  const hours = (jst.getHours() < 10 ? `0${jst.getHours()}` : jst.getHours());
  const minutes = (jst.getMinutes() < 10 ? `0${jst.getMinutes()}` : jst.getMinutes());

  return `${hours}:${minutes} JST`;
}

describe('Time', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should activate in beginning of phrase', () => {
      time.message('Mocha', '#test', '.time JST');
      assert.notEqual(client.lastMessage, null);
    });

    it('should not activate in middle of phrase', () => {
      time.message('Mocha', '#test', 'test .time JST');
      assert.equal(client.lastMessage, null);
    });

    it('should handle regions', () => {
      time.message('Mocha', '#test', '.time Asia/Tokyo');
      assert.notEqual(client.lastMessage, null);
      assert(!client.lastMessage.includes('Invalid timezone'), 'Region not recognized');
    });

    it('should handle incorrect timezones', () => {
      time.message('Mocha', '#test', `.time JET`);
      assert(client.lastMessage.includes('Invalid timezone'), 'Invalid timezone not reported');
    });

    it('should ignore incorrect formatting', () => {
      time.message('Mocha', '#test', '.time Asia/Tokyo JST');
      assert.equal(client.lastMessage, null);
    });

    it('should be case insensitive', () => {
      time.message('Mocha', '#test', '.TIME JST');
      assert.notEqual(client.lastMessage, null);
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      time.message('Mocha', '#test', '.time JST');
      assert.equal(client.lastTarget, '#test');
    });

    it("should include user's name", () => {
      time.message('Mocha', '#test', '.time JST');
      assert(client.lastMessage.startsWith('Mocha: '), 'Does not contain username');
    });

    it('should display the correct time', () => {
      time.message('Mocha', '#test', '.time JST');
      assert(client.lastMessage.includes(getJST()), 'Current time incorrect');
    });

    it('should be case insensitive', () => {
      time.message('Mocha', '#test', '.time jst');
      assert(client.lastMessage.includes(getJST()), 'Current time incorrect');
    });
  });
});
