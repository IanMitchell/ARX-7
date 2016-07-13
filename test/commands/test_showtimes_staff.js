import 'babel-polyfill';
import { describe, before, beforeEach, afterEach, it } from 'mocha';
import assert from 'assert';
import { Client } from '../helpers.js';
import { ShowtimesStaff } from '../../src/commands/showtimes_staff';

const client = new Client();
const showtimes = new ShowtimesStaff(client, null);

describe('Blame', () => {
  describe('Triggers', () => {
    beforeEach(() => showtimes.isAuthorized = () => new Promise(resolve => resolve(true)));

    it('should respond to .done trigger');

    it('should respond to .undone trigger');

    it('should not activate in middle of phrase');

    it('should be case insensitive');
  });

  describe('General Usage', () => {
    it('should respond in correct channel');

    it('should be restricted to authorized members');

    it('should identify optional position');
  });

  // To avoid repeatedly spamming endpoint, we only hit the API once. The
  // lastMessage contains the results; these tests don't need fresh results.
  describe('Message Formatting', () => {
    // before(() => showtimes.message('Mocha', '#arx-7', '.done aoty'));

    it('should should include blame');

    it('should include staff name');
  });
});
