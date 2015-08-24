import assert from "assert";
import {Client} from "../helpers.js";
import {Choose} from "./../../src/commands/choose";

let client = new Client();
let choose = new Choose(client);

describe('Choose', () => {
  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      choose.message('Mocha', '#test', '.c this, that', null);
      assert.equal('#test', client.lastTarget);
      client.resetLog();
    });

    it('should activate in beginning of phrase', () => {
      choose.message('Mocha', '#test', '.c this, that', null);
      assert.notEqual(null, client.lastMessage);
      client.resetLog();
    });

    it('should not activate in middle of phrase', () => {
      choose.message('Mocha', '#test', 'test .c this, that', null);
      assert.equal(null, client.lastMessage);
      client.resetLog();
    });

    it("should include user's name", () => {
      choose.message('Mocha', '#test', '.choose this, that', null);
      assert(client.lastMessage.startsWith('Mocha: '));
      client.resetLog();
    });

    it('should respond to triggers', () => {
      choose.message('Mocha', '#test', '.c this, that', null);
      assert(client.lastMessage);
      client.resetLog();

      choose.message('Mocha', '#test', '.choose this, that', null);
      assert(client.lastMessage);
      client.resetLog();

      choose.message('Mocha', '#test', '.erande this, that', null);
      assert(client.lastMessage);
      client.resetLog();

      choose.message('Mocha', '#test', '.選んで this, that', null);
      assert(client.lastMessage);
      client.resetLog();

      choose.message('Mocha', '#test', '.選ぶがよい this, that', null);
      assert(client.lastMessage);
      client.resetLog();

      choose.message('Mocha', '#test', '.choo this, that', null);
      assert.equal(null, client.lastMessage);
      client.resetLog();
    });
  });

  describe('Comma Delimited List', () => {
    it('should choose from the list', () => {
      choose.message('Mocha', '#test', '.choose that, that', null);
      assert.equal('Mocha: that', client.lastMessage);
      client.resetLog();
    });
  });

  describe('Space Delimited List', () => {
    it('should choose from the list', () => {
      choose.message('Mocha', '#test', '.c commie commie');
      assert.equal('Mocha: commie', client.lastMessage);
      client.resetLog();
    });
  });

  describe('Range', () => {
    it('should choose from within range', () => {
      assert(false, 'Not implemented');
    });

    it('should handle reverse ranges', () => {
      assert(false, 'Not implemented');
    });

    it('should handle negative ranges', () => {
      assert(false, 'Not implemented');
    });

    it('should include lower and upper bounds', () => {
      assert(false, 'Not implemented');
    });
  });

  describe('Decimal Range', () => {
    it('should choose from within range', () => {
      assert(false, 'Not implemented');
    });

    it('should handle integer and float mixes', () => {
      assert(false, 'Not implemented');
    });

    it('should handle different mantissas', () => {
      assert(false, 'Not implemented');
    });
  });
});
