import {describe, afterEach, it} from 'mocha';
import assert from 'assert';
import {Client} from '../helpers.js';
import {Choose} from '../../src/commands/choose';

const client = new Client();
const choose = new Choose(client);

describe('Choose', () => {
  afterEach(() => client.resetLog());

  describe('Triggers', () => {
    it('should respond to .c trigger', () => {
      return choose.message('Mocha', '#test', '.c this, that').then(() => {
        assert(client.lastMessage);
      });
    });

    it('should respond to .choose trigger', () => {
      return choose.message('Mocha', '#test', '.choose one, two').then(() => {
        assert(client.lastMessage);
      });
    });

    it('should respond to .erande trigger', () => {
      return choose.message('Mocha', '#test', '.erande one, two').then(() => {
        assert(client.lastMessage);
      });
    });

    it('should respond to .選んで trigger', () => {
      return choose.message('Mocha', '#test', '.選んで one, two').then(() => {
        assert(client.lastMessage);
      });
    });

    it('should respond to .選ぶがよい trigger', () => {
      return choose.message('Mocha', '#test', '.選ぶがよい one, two').then(() => {
        assert(client.lastMessage);
      });
    });

    it('should not respond to .choo trigger', () => {
      return choose.message('Mocha', '#test', '.choo one, two').then(() => {
        assert.equal(null, client.lastMessage);
      });
    });

    it('should activate in beginning of phrase', () => {
      return choose.message('Mocha', '#test', '.c this, that').then(() => {
        assert.notEqual(null, client.lastMessage);
      });
    });

    it('should not activate in middle of phrase', () => {
      return choose.message('Mocha', '#test', 'test .c this, that').then(() => {
        assert.equal(null, client.lastMessage);
      });
    });

    it('should not activate with an empty list', () => {
      return choose.message('Mocha', '#test', '.c').then(() => {
        assert.equal(null, client.lastMessage);
      });
    });

    it('should activate with a list of commas', () => {
      const outputs = [
        'Mocha: ,,',
        'Mocha: ,',
      ];

      return choose.message('Mocha', '#test', '.c ,, , ,,').then(() => {
        assert(outputs.includes(client.lastMessage));
      });
    });

    it('should activate with a single commas', () => {
      return choose.message('Mocha', '#test', '.c , ').then(() => {
        assert.equal('Mocha: ,', client.lastMessage);
      });
    });

    it('should be case insensitive', () => {
      return choose.message('Mocha', '#test', '.CHOOSE A').then(() => {
        assert.equal('Mocha: A', client.lastMessage);
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return choose.message('Mocha', '#test', '.c this, that').then(() => {
        assert.equal('#test', client.lastTarget);
      });
    });

    it("should include user's name", () => {
      return choose.message('Mocha', '#test', '.choose this, that').then(() => {
        assert(client.lastMessage.startsWith('Mocha: '));
      });
    });
  });

  describe('Comma Delimited List', () => {
    it('should choose from the list', () => {
      return choose.message('Mocha', '#test', '.choose that, that').then(() => {
        assert.equal('Mocha: that', client.lastMessage);
      });
    });
  });

  describe('Space Delimited List', () => {
    it('should choose from the list', () => {
      return choose.message('Mocha', '#test', '.c commie commie').then(() => {
        assert.equal('Mocha: commie', client.lastMessage);
      });
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
        assert(value >= lowerBound);
        assert(value <= upperBound);
      }
    });

    it('should handle reverse ranges', () => {
      const lowerBound = 0;
      const upperBound = 5;
      const range = `${upperBound}-${lowerBound}`;


      return choose.message('Mocha', '#test', `.c ${range}`).then(() => {
        const value = client.lastMessage.replace('Mocha: ', '');
        assert(value <= upperBound);
        assert(value >= lowerBound);
      });
    });

    it('should handle negative ranges', () => {
      const lowerBound = -10;
      const upperBound = -5;
      const range = `${lowerBound}-${upperBound}`;


      return choose.message('Mocha', '#test', `.c ${range}`).then(() => {
        const value = client.lastMessage.replace('Mocha: ', '');
        assert(value <= upperBound);
        assert(value >= lowerBound);
      });
    });

    it('should include lower and upper bounds', () => {
      const lowerBound = 0;
      const upperBound = 2;
      const range = `${upperBound}-${lowerBound}`;
      let runs = 10;
      let lowerBoundChosen = false;
      let upperBoundChosen = false;

      return new Promise(resolve => {
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
          if (i + 1 === runs) {
            resolve();
          }
        }
      }).then(() => {
        assert(lowerBoundChosen);
        assert(upperBoundChosen);
      });
    });
  });

  describe('Decimal Range', () => {
    it('should choose from within range');

    it('should handle integer and float mixes');

    it('should handle different mantissas');
  });
});
