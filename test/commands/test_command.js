import 'babel-polyfill';
import { describe, afterEach, it } from 'mocha';
import assert from 'assert';
import { Client } from '../helpers.js';
import { Command } from '../../src/commands/command';

const client = new Client();
const command = new Command(client);

describe('Command', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Blacklist', () => {
    it('should block .ly links', () => {
      command.send('#test', 'Desch: http://bit.ly link');
      assert.equal(client.lastMessage, 'Blacklist triggered.');
    });

    it('should block .lewd', () => {
      command.send('#test', 'Desch: .lewd');
      assert.equal(client.lastMessage, 'Blacklist triggered.');
    });

    it('should block `xd`', () => {
      command.send('#test', 'Desch: xd');
      assert.equal(client.lastMessage, 'Blacklist triggered.');
    });

    it('should not block xdcc', () => {
      command.send('#test', 'Desch: xdcc');
      assert.equal(client.lastMessage, 'Desch: xdcc');
    });
  });
});
