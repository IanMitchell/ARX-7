import assert from "assert";
import timezone from 'timezone/loaded';
import {Client} from "../helpers.js";
import {TIME_FORMAT, Time} from "../../src/commands/time";

// +9h UTC offset
const JST_OFFSET = 1000 * 60 * 60 * 9;

let client = new Client();
let time = new Time(client);

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
        assert.notEqual(null, client.lastMessage);
      });
    });

    it('should not activate in middle of phrase', () => {
      return time.message('Mocha', '#test', 'test .time JST').then(() => {
        assert.equal(null, client.lastMessage);
      });
    });

    it('should handle incorrect timezones', () => {
      return time.message('Mocha', '#test', `.time JET`).then(() => {
        assert(client.lastMessage.endsWith(timezone(new Date(), TIME_FORMAT)));
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return time.message('Mocha', '#test', '.time JST').then(() => {
        assert.equal('#test', client.lastTarget);
      });
    });

    it("should include user's name", () => {
      return time.message('Mocha', '#test', '.time JST').then(() => {
        assert(client.lastMessage.startsWith('Mocha: '));
      });
    });

    it('should display the correct time', () => {
      let jst = getJST();
      return time.message('Mocha', '#test', '.time JST').then(() => {
        let time = timezone(jst, TIME_FORMAT).split(" GMT")[0];
        assert(client.lastMessage.includes(time));
      });
    });

    it('should be case insensitive', () => {
      let jst = getJST();
      return time.message('Mocha', '#test', '.time jst').then(() => {
        let time = timezone(jst, TIME_FORMAT).split(" GMT")[0];
        assert(client.lastMessage.includes(time));
      });
    });
  });
});
