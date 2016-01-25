import 'babel-polyfill';
import { describe, before, beforeEach, afterEach, it } from 'mocha';
import assert from 'assert';
import { Client } from '../helpers.js';
import { ShowtimesRelease } from '../../src/commands/showtimes_release';

const client = new Client();
const release = new ShowtimesRelease(client, null);

describe('Blame', () => {
  describe('Triggers', () => {
    beforeEach(() => release.isAuthorized = () => new Promise(resolve => resolve(true)));

    it('should respond to .release trigger');

    it('should not activate in middle of phrase');

    it('should be case insensitive');
  });

  describe('General Usage', () => {
    it('should respond in correct channel');

    it('should be restricted to authorized members');
  });

  // To avoid repeatedly spamming endpoint, we only hit the API once. The
  // lastMessage contains the results; these tests don't need fresh results.
  describe('Message Formatting', () => {
    // before(() => release.message('Mocha', '#arx-7', '.release aoty'));

    it('should should include show name');

    it('should include episode number');
  });
});
