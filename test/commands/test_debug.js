import assert from "assert";
import {Client} from "../helpers.js";
import {Debug} from "./../../src/commands/debug";

let client = new Client();
let debug = new Debug(client);

describe('Debug', () => {
  describe("> ping", () => {
    it('should respond', () => {
      debug.message('Mocha', '#test', 'ping', null);
      assert.equal('pong', client.lastMessage);
    });
  });

  describe("> bot respond", () => {
    it('should respond', () => {
      debug.message('Mocha', '#test', 'bot respond', null);
      assert.equal("I'm a pretty stupid bot.", client.lastMessage);
    });
  });

  describe("> bot be nice", () => {
    it('should respond', () => {
      debug.message('Mocha', '#test', 'bot be nice', null)
      assert.equal("sorry :(", client.lastMessage);
    });
  });

  describe("> gj bot", () => {
    it('should respond', () => {
      debug.message('Mocha', '#test', 'gj bot', null);
      assert.equal('thx', client.lastMessage);
    });
  });
});
