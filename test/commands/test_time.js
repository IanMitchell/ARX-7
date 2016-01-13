import 'babel-polyfill';
import { describe, afterEach, it } from 'mocha';
import assert from 'assert';
import timezone from 'timezone/loaded';
import { Client } from '../helpers.js';
import { TIME_FORMAT, Time } from '../../src/commands/time';

// +9h UTC offset
const JST_OFFSET = 1000 * 60 * 60 * 9;

const client = new Client();
const time = new Time(client);

function getJST() {
  return new Date(Date.now() + JST_OFFSET);
}

describe('Time', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should activate in beginning of phrase', () => {
      return time.message('Mocha', '#test', '.time JST').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should not activate in middle of phrase', () => {
      return time.message('Mocha', '#test', 'test .time JST').then(() => {
        assert.equal(client.lastMessage, null);
      });
    });

    it('should handle incorrect timezones', () => {
      return time.message('Mocha', '#test', `.time JET`).then(() => {
        assert(client.lastMessage.endsWith(timezone(new Date(), TIME_FORMAT)), 'Incorrect Timezone Ending');
      });
    });

    it('should be case insensitive', () => {
      return time.message('Mocha', '#test', '.TIME JST').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return time.message('Mocha', '#test', '.time JST').then(() => {
        assert.equal(client.lastTarget, '#test');
      });
    });

    it("should include user's name", () => {
      return time.message('Mocha', '#test', '.time JST').then(() => {
        assert(client.lastMessage.startsWith('Mocha: '), 'Does not contain username');
      });
    });

    it('should display the correct time', () => {
      const jst = getJST();

      return time.message('Mocha', '#test', '.time JST').then(() => {
        const currentTime = timezone(jst, TIME_FORMAT).split(' GMT')[0];
        assert(client.lastMessage.includes(currentTime), 'Current time incorrect');
      });
    });

    it('should be case insensitive', () => {
      const jst = getJST();

      return time.message('Mocha', '#test', '.time jst').then(() => {
        const currentTime = timezone(jst, TIME_FORMAT).split(' GMT')[0];
        assert(client.lastMessage.includes(currentTime), 'Current time incorrect');
      });
    });
  });
});
