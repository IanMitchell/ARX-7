import assert from "assert";
import {Client} from "../helpers.js";
import {Reply} from "../../src/commands/reply";

let client = new Client();
let reply = new Reply(client);

describe('Reply', () => {
  describe("> ping", () => {
    it('should respond', () => {
      reply.message('Mocha', '#test', 'ping', null);
      assert.equal('pong', client.lastMessage);
    });

    it ('should respond in correct channel', () => {
      reply.message('Mocha', '#test', 'ping', null);
      assert.equal('#test', client.lastTarget);
    });
  });

  describe("> bot respond", () => {
    it('should respond', () => {
      reply.message('Mocha', '#test', 'bot respond', null);
      assert.equal("I'm a pretty stupid bot.", client.lastMessage);
    });

    it ('should respond in correct channel', () => {
      reply.message('Mocha', '#test', 'bot respond', null);
      assert.equal('#test', client.lastTarget);
    });
  });

  describe("> bot be nice", () => {
    it('should respond', () => {
      reply.message('Mocha', '#test', 'bot be nice', null)
      assert.equal("sorry :(", client.lastMessage);
    });

    it ('should respond in correct channel', () => {
      reply.message('Mocha', '#test', 'bot be nice', null);
      assert.equal('#test', client.lastTarget);
    });
  });

  describe("> gj bot", () => {
    it('should respond', () => {
      reply.message('Mocha', '#test', 'gj bot', null);
      assert.equal('thx', client.lastMessage);
    });


    it ('should respond in correct channel', () => {
      reply.message('Mocha', '#test', 'gj bot', null);
      assert.equal('#test', client.lastTarget);
    });
  });
});
