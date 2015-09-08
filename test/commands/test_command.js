import assert from "assert";
import {Client} from "../helpers.js";
import {Command} from "../../src/commands/command";

let client = new Client();
let command = new Command(client);

describe('Command', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Blacklist', () => {
    it('should block `xd`', () => {
      command.send('#test', 'xd');
      assert.equal('Blacklist triggered.', client.lastMessage);
    });
  });
});
