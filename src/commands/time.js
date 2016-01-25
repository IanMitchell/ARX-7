import debug from 'debug';
import moment from 'moment-timezone';
import { Command } from './command.js';

const log = debug('Time');

export class Time extends Command {
  constructor(client) {
    super(client);
    this.zones = new Map([
      ['JST', 'Asia/Tokyo'],
      ['EST', 'America/New_York'],
      ['EDT', 'America/New_York'],
      ['CST', 'America/Chicago'],
      ['CDT', 'America/Chicago'],
      ['PST', 'America/Los_Angeles'],
      ['PDT', 'America/Los_Angeles'],
    ]);
  }

  message(from, to, text) {
    const timezoneRegex = /^[.!]time ([\w/]+)$/i;
    const match = text.match(timezoneRegex);

    if (match) {
      log(`${from} on: ${match[1]}`);
      this.send(to, `${from}: ${this.getTime(match[1])}`);
    }
  }

  getTime(input) {
    let zone = input;

    if (this.zones.has(input.toUpperCase())) {
      zone = this.zones.get(input.toUpperCase());
    }

    if (moment.tz.zone(zone)) {
      return moment(Date.now()).tz(zone).format('ddd MMM Do HH:mm z');
    }

    return `Invalid timezone (abbrs: ${[...this.zones.keys()].join(', ')})`;
  }

  help(from) {
    this.client.notice(from, `.time [timezone]; returns the current time. (Ex: .time JST).`);
  }
}
