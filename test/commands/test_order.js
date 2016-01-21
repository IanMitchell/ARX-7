import 'babel-polyfill';
import { describe, afterEach, it } from 'mocha';
import assert from 'assert';
import { Client } from '../helpers.js';
import { Order } from '../../src/commands/order';

const client = new Client();
const order = new Order(client);

function uniq(arr) {
  const seen = {};
  return arr.filter((item) => {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

describe('Order', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should respond to .o trigger', () => {
      return order.message('Mocha', '#test', '.o this, that').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should respond to .order trigger', () => {
      return order.message('Mocha', '#test', '.order one, two').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should not respond to .orde trigger', () => {
      return order.message('Mocha', '#test', '.orde one, two').then(() => {
        assert.equal(client.lastMessage, null);
      });
    });

    it('should activate in beginning of phrase', () => {
      return order.message('Mocha', '#test', '.o this, that').then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should not activate in middle of phrase', () => {
      return order.message('Mocha', '#test', 'test .o this, that').then(() => {
        assert.equal(client.lastMessage, null);
      });
    });

    it('should not activate with an empty list', () => {
      return order.message('Mocha', '#test', '.o').then(() => {
        assert.equal(client.lastMessage, null);
      });
    });

    it('should activate with a list of commas', () => {
      const outputs = [
        'Mocha: ,,, ,,, ,',
        'Mocha: ,, ,,, ,,',
        'Mocha: ,,, ,, ,,',
      ];

      return order.message('Mocha', '#test', '.o ,, , ,,').then(() => {
        assert(outputs.includes(client.lastMessage), 'Output not found in valid list');
      });
    });

    it('should activate with a single comma', () => {
      return order.message('Mocha', '#test', '.o ,').then(() => {
        assert.equal(client.lastMessage, 'Mocha: ,');
      });
    });

    it('should be case insensitive', () => {
      return order.message('Mocha', '#test', '.ORDER A').then(() => {
        assert.equal(client.lastMessage, 'Mocha: A');
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return order.message('Mocha', '#test', '.o this, that').then(() => {
        assert.equal(client.lastTarget, '#test');
      });
    });

    it("should include user's name", () => {
      return order.message('Mocha', '#test', '.order this, that').then(() => {
        assert(client.lastMessage.startsWith('Mocha: '));
      });
    });
  });

  describe('Range', () => {
    it('should choose from within range', () => {
      const lowerBound = 0;
      const upperBound = 10;
      const range = `${lowerBound}-${upperBound}`;


      return order.message('Mocha', '#test', `.o ${range}`).then(() => {
        const values = client.lastMessage.replace('Mocha: ', '').split(', ');
        values.forEach(val => {
          assert(val >= lowerBound, 'Value less than lower bound');
          assert(val <= upperBound, 'Value greater than upper bound');
        });
      });
    });

    it('should handle reverse ranges', () => {
      const expected = [
        'Mocha: 5, 6',
        'Mocha: 6, 5',
      ];

      return order.message('Mocha', '#test', '.o 6-5').then(() => {
        assert(expected.includes(client.lastMessage), 'Output not found in valid list');
      });
    });

    it('should handle negative ranges', () => {
      const expected = [
        'Mocha: -5, -6',
        'Mocha: -6, -5',
      ];

      return order.message('Mocha', '#test', '.o -5--6').then(() => {
        assert(expected.includes(client.lastMessage), 'Output not found in valid list');
      });
    });

    it('should include lower and upper bounds', () => {
      const lowerBound = 0;
      const upperBound = 5;
      const range = `${lowerBound}-${upperBound}`;

      return order.message('Mocha', '#test', `.o ${range}`).then(() => {
        const values = client.lastMessage.replace('Mocha: ', '').split(', ');
        assert(values.includes(lowerBound.toString()), 'Lowerbound not included');
        assert(values.includes(upperBound.toString()), 'Upperbound not included');
      });
    });

    it('should only include a max of 20 items', () => {
      return order.message('Mocha', '#test', '.o 1-25').then(() => {
        assert.equal(21, client.lastMessage.split(', ').length, 'More results than expected');
        assert(client.lastMessage.includes('and some more...'), "'More' not included");
      });
    });

    it('should cap range at 1024', () => {
      return order.message('Mocha', '#test', '.o 1-2048').then(() => {
        let msg = client.lastMessage.replace('Mocha: ', '');
        msg = msg.replace(', and some more...', '');
        msg.split(', ').forEach(val => assert(val <= 1024, 'Value over 1024'));
      });
    });

    // The torchlight test
    it('should handle large numbers', () => {
      const val = 9007199254740992;
      return order.message('Mocha', '#test', `.o ${val}-${val + 2}`).then(() => {
        assert.equal(client.lastMessage, 'Mocha: Value is too high.');
      });
    });
  });

  describe('List', () => {
    it('should choose from within list', () => {
      const expected = [
        'Mocha: a, b c, d',
        'Mocha: a, d, b c',
        'Mocha: b c, a, d',
        'Mocha: b c, d, a',
        'Mocha: d, a, b c',
        'Mocha: d, b c, a',
      ];

      return order.message('Mocha', '#test', '.o a, b c, d').then(() => {
        assert(expected.includes(client.lastMessage), 'Value not in expected list');
      });
    });

    it('should randomize results', () => {
      const expected = [
        'Mocha: a, b, c',
        'Mocha: a, c, b',
        'Mocha: b, a, c',
        'Mocha: b, c, a',
        'Mocha: c, a, b',
        'Mocha: c, b, a',
      ];

      const results = new Array();
      let runs = 10;

      return new Promise(resolve => {
        for (let i = 0; i < runs; i++) {
          order.message('Mocha', '#test', '.o a b c');
          assert(expected.includes(client.lastMessage), 'Value not in expected list');
          results.push(client.lastMessage);

          // Still can fail, but has a [(0.167^20) * 100]% chance of it
          if (i === 9 && uniq(results).length === 1) {
            runs *= 2;
          }
          if (i + 1 === runs) {
            resolve();
          }
        }
      }).then(() => {
        assert(uniq(results).length > 1, 'Results not randomized (possible)');
      });
    });
  });
});
