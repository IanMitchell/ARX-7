import 'babel-polyfill';
import { describe, afterEach, it } from 'mocha';
import assert from 'assert';
import { Client } from '../helpers.js';
import { Choose } from '../../src/commands/choose';

const client = new Client();
const choose = new Choose(client);

describe('Choose', () => {
  afterEach(() => client.resetLog());

  describe('Triggers', () => {
    it('should respond to .c trigger', () => {
      choose.message('Mocha', '#test', '.c this, that');
      assert(client.lastMessage, 'Bot did not send message to channel');
    });

    it('should respond to .choose trigger', () => {
      choose.message('Mocha', '#test', '.choose one, two');
      assert(client.lastMessage, 'Bot did not send message to channel');
    });

    it('should respond to .erande trigger', () => {
      choose.message('Mocha', '#test', '.erande one, two');
      assert(client.lastMessage, 'Bot did not send message to channel');
    });

    it('should respond to .選んで trigger', () => {
      choose.message('Mocha', '#test', '.選んで one, two');
      assert(client.lastMessage, 'Bot did not send message to channel');
    });

    it('should respond to .選ぶがよい trigger', () => {
      choose.message('Mocha', '#test', '.選ぶがよい one, two');
      assert(client.lastMessage, 'Bot did not send message to channel');
    });

    it('should not respond to .choo trigger', () => {
      choose.message('Mocha', '#test', '.choo one, two');
      assert(!client.lastMessage, 'Bot sent message to channel');
    });

    it('should activate in beginning of phrase', () => {
      choose.message('Mocha', '#test', '.c this, that');
      assert(client.lastMessage, 'Bot did not send message to channel');
    });

    it('should not activate in middle of phrase', () => {
      choose.message('Mocha', '#test', 'test .c this, that');
      assert(!client.lastMessage, 'Bot sent message to channel');
    });

    it('should not activate with an empty list', () => {
      choose.message('Mocha', '#test', '.c');
      assert.equal(client.lastMessage, null);
    });

    it('should activate with a list of commas', () => {
      const outputs = [
        'Mocha: ,,',
        'Mocha: ,',
      ];

      choose.message('Mocha', '#test', '.c ,, , ,,');
      assert(outputs.includes(client.lastMessage), 'Invalid option chosen');
    });

    it('should activate with a single commas', () => {
      choose.message('Mocha', '#test', '.c , ');
      assert.equal(client.lastMessage, 'Mocha: ,');
    });

    it('should be case insensitive', () => {
      choose.message('Mocha', '#test', '.CHOOSE A');
      assert.equal(client.lastMessage, 'Mocha: A');
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      choose.message('Mocha', '#test', '.c this, that');
      assert.equal(client.lastTarget, '#test');
    });

    it("should include user's name", () => {
      choose.message('Mocha', '#test', '.choose this, that');
      assert(client.lastMessage.startsWith('Mocha: '), 'Invalid username prefix');
    });
  });

  describe('Comma Delimited List', () => {
    it('should choose from the list', () => {
      choose.message('Mocha', '#test', '.choose that, that');
      assert.equal(client.lastMessage, 'Mocha: that');
    });
  });

  describe('Space Delimited List', () => {
    it('should choose from the list', () => {
      choose.message('Mocha', '#test', '.c commie commie');
      assert.equal(client.lastMessage, 'Mocha: commie');
    });
  });

  describe('Range', () => {
    it('should choose from within range', () => {
      const lowerBound = 0;
      const upperBound = 10;
      const range = `${upperBound}-${lowerBound}`;

      for (let i = 0; i < 20; i++) {
        choose.message('Mocha', '#test', `.c ${range}`);
        const value = client.lastMessage.replace('Mocha: ', '');
        assert(value >= lowerBound, 'Value less than lower bound');
        assert(value <= upperBound, 'Value greater than upper bound');
      }
    });

    it('should handle reverse ranges', () => {
      const lowerBound = 0;
      const upperBound = 5;
      const range = `${upperBound}-${lowerBound}`;

      choose.message('Mocha', '#test', `.c ${range}`);
      const value = client.lastMessage.replace('Mocha: ', '');
      assert(value >= lowerBound, 'Value less than lower bound');
      assert(value <= upperBound, 'Value greater than upper bound');
    });

    it('should handle negative ranges', () => {
      const lowerBound = -10;
      const upperBound = -5;
      const range = `${lowerBound}-${upperBound}`;

      choose.message('Mocha', '#test', `.c ${range}`);
      const value = client.lastMessage.replace('Mocha: ', '');
      assert(value >= lowerBound, 'Value less than lower bound');
      assert(value <= upperBound, 'Value greater than upper bound');
    });

    it('should include lower and upper bounds', () => {
      const lowerBound = 0;
      const upperBound = 2;
      const range = `${upperBound}-${lowerBound}`;
      let runs = 10;
      let lowerBoundChosen = false;
      let upperBoundChosen = false;

      for (let i = 0; i < runs; i++) {
        choose.message('Mocha', '#test', `.c ${range}`);
        const value = client.lastMessage.replace('Mocha: ', '');

        if (value === lowerBound.toString()) {
          lowerBoundChosen = true;
        }
        if (value === upperBound.toString()) {
          upperBoundChosen = true;
        }

        // Still can fail, but has a [(0.333^20) * 100]% chance of it
        if (i === 9 && (!lowerBoundChosen || !upperBoundChosen)) {
          runs *= 2;
        }
      }

      assert(lowerBoundChosen, 'Lower bound not chosen (possible)');
      assert(upperBoundChosen, 'Upper bound not chosen (possible)');
    });
  });

  describe('Decimal Range', () => {
    it('should choose from within range');

    it('should handle integer and float mixes');

    it('should handle different mantissas');
  });
});
