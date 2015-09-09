import assert from "assert";
import {Client} from "../helpers.js";
import {Order} from "../../src/commands/order";

let client = new Client();
let order = new Order(client);

describe('Order', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should respond to .o trigger', () => {
      return order.message('Mocha', '#test', '.o this, that').then(() => {
        assert(client.lastMessage);
      });
    });

    it('should respond to .order trigger', () => {
      return order.message('Mocha', '#test', '.order one, two').then(() => {
        assert(client.lastMessage);
      });
    });

    it('should not respond to .orde trigger', () => {
      return order.message('Mocha', '#test', '.orde one, two').then(() => {
        assert.equal(null, client.lastMessage);
      });
    });

    it('should activate in beginning of phrase', () => {
      return order.message('Mocha', '#test', '.o this, that').then(() => {
        assert.notEqual(null, client.lastMessage);
      });
    });

    it('should not activate in middle of phrase', () => {
      return order.message('Mocha', '#test', 'test .o this, that').then(() => {
        assert.equal(null, client.lastMessage);
      });
    });

    it('should not activate with an empty list', () => {
      return order.message('Mocha', '#test', '.o').then(() => {
        assert.equal(null, client.lastMessage);
      });
    });

    it('should activate with a list of commas', () => {
      let outputs = [
        'Mocha: ,,, ,,, ,',
        'Mocha: ,, ,,, ,,',
        'Mocha: ,,, ,, ,,'
      ];
      
      return order.message('Mocha', '#test', '.o ,, , ,,').then(() => {
        assert(outputs.includes(client.lastMessage));
      });
    });

    it('should activate with a single comma', () => {
      return order.message('Mocha', '#test', '.o ,').then(() => {
        assert.equal('Mocha: ,', client.lastMessage);
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return order.message('Mocha', '#test', '.o this, that').then(() => {
        assert.equal('#test', client.lastTarget);
      });
    });

    it("should include user's name", () => {
      return order.message('Mocha', '#test', '.order this, that').then(() => {
        assert(client.lastMessage.startsWith('Mocha: '));
      });
    });
  });

  describe('Range', () => {
    it('should choose from within range');

    it('should handle reverse ranges');

    it('should handle negative ranges');

    it('should include lower and upper bounds');

    it('should only include a max of 20 items');
  });

  describe('List', () => {
    it('should choose from within list');

    it('should only include a max of 20 items');

    it('should randomize results');
  });
});
