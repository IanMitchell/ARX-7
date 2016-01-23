import 'babel-polyfill';
import { describe, before, afterEach, it } from 'mocha';
import assert from 'assert';
import { Client } from '../helpers.js';
import { Blame } from '../../src/commands/blame';

const client = new Client();
const blame = new Blame(client);

describe('Blame', () => {
  describe('Triggers', () => {
    afterEach(() => client.resetLog());

    it('should respond to .blame trigger', () => {
      return blame.message('Mocha', '#arx-7', '.blame').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should respond to .blame <show> trigger', () => {
      return blame.message('Mocha', '#arx-7', '.blame aoty').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should respond to .show <show> trigger', () => {
      return blame.message('Mocha', '#arx-7', '.show aoty').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should not activate in middle of phrase', () => {
      return blame.message('Mocha', '#arx-7', 'test .blame aoty').then(() => {
        assert.equal(client.lastMessage, null);
      });
    });

    it('should be case insensitive', () => {
      return blame.message('Mocha', '#arx-7', '.BLAME AOTY').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return blame.message('Mocha', '#arx-7', '.blame AOTY').then(() => {
        assert.equal(client.lastTarget, '#arx-7');
      });
    });

    it('should respond with correct usage', () => {
      return blame.message('Mocha', '#arx-7', '.blame').then(() => {
        assert(client.lastMessage.startsWith('Please use:'), 'Incorrect usage information');
      });
    });
  });

  // To avoid repeatedly spamming endpoint, we only hit the API once. The
  // lastMessage contains the results; these tests don't need fresh results.
  describe('Message Formatting', () => {
    before(() => blame.message('Mocha', '#arx-7', '.blame aoty'));

    it('should should include show name', () => {
      assert(client.lastMessage.includes("Desch's Slice of Life"), 'Show name not present');
    });

    it('should include episode number', () => {
      assert(client.lastMessage.includes('Ep 7'), 'Episode number not present');
    });

    it('should use position acronym', () => {
      assert(client.lastMessage.includes('TL'), 'TL acronym not present');
      assert(!client.lastMessage.includes('Translator'), 'Translator position present');
    });

    it('should color completed positions green', () => {
      assert(client.lastMessage.includes('\u0002QC'), 'QC not marked as complete');
    });

    it('should color incompleted positions red', () => {
      assert(client.lastMessage.includes('\u0002TL'), 'TL not marked as incomplete');
    });

    it('should reduce multiple positions');

    it('should indicate incomplete on mix jobs');

    it('should not include staff names', () => {
      assert(!client.lastMessage.includes('at Desch'), 'Staff name included');
      assert(!client.lastMessage.includes('Fyurie'), 'Staff name included');
    });

    it('should include air date', () => {
      let present = false;
      present = client.lastMessage.includes('airs') || client.lastMessage.includes('aired');
      assert(present, 'Air date not present');
    });

    // These tests require custom commands for test shows at different stages
    it('should include last update');

    it('should indicate release status');
  });
});
