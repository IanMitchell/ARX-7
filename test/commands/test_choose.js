import assert from "assert";
import {Client} from "../helpers.js";
import {Choose} from "../../src/commands/choose";

let client = new Client();
let choose = new Choose(client);

describe('Choose', () => {
  afterEach(() => {
    client.resetLog();
  });

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

    it("shouldn't respond to .choo trigger", () => {
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
    it('should choose from within range');

    it('should handle reverse ranges');

    it('should handle negative ranges');

    it('should include lower and upper bounds');
  });

  describe('Decimal Range', () => {
    it('should choose from within range');

    it('should handle integer and float mixes');

    it('should handle different mantissas');
  });
});
