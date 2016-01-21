import 'babel-polyfill';
import { describe, afterEach, it } from 'mocha';
import assert from 'assert';
import { Client } from '../helpers.js';
import { Twitter } from '../../src/commands/twitter';

const client = new Client();
const twitter = new Twitter(client);

const link = 'https://twitter.com/IanMitchel1/status/636939838512500736';
const malformed = 'https://twitter.com/IanMitchel1/status/6369398385125007365';

describe('Twitter', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should activate anywhere in phrase', () => {
      return twitter.message('Mocha', '#test', `Tweet ${link}!`).then(() => {
        assert.notEqual(client.lastMessage, null);
      });
    });

    it('should log and handle malformed links', () => {
      return twitter.message('Mocha', '#test', `${malformed}`).catch(error => {
        assert(error instanceof Error, 'Incorrect Error returned');
        assert(error.message.startsWith('Twitter Info'), 'Incorrect Error message');
        assert.equal(client.lastMessage, 'Sorry, could not find Twitter info.');
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return twitter.message('Mocha', '#test', link).then(() => {
        assert.equal(client.lastTarget, '#test');
      });
    });

    it('should include [Twitter]', () => {
      return twitter.message('Mocha', '#test', link).then(() => {
        assert(client.lastMessage.startsWith('[Twitter]: '), 'Message not properly tagged');
      });
    });
  });

  describe('Tweet Lookup', () => {
    it('should include username and Twitter handle', () => {
      return twitter.message('Mocha', '#test', link).then(() => {
        const tweet = client.lastMessage.toLowerCase();
        const expected = ' | By Ian Mitchell (@IanMitchel1)'.toLowerCase();
        assert(tweet.includes(expected), 'Incorrect tweet information');
      });
    });

    it('should handle special characters', () => {
      return twitter.message('Mocha', '#test', link).then(() => {
        const tweet = client.lastMessage.toLowerCase();
        assert((tweet.includes('<') && tweet.includes('>')), 'Message missing special characters');
      });
    });
  });
});
