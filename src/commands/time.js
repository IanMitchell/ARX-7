import timezone from 'timezone/loaded';
import { Command } from './command.js';

export const TIME_FORMAT = `%a %b %d %Y %H:%M:%S GMT%z (%Z)`;

export class Time extends Command {
  message(from, to, text) {
    return new Promise(resolve => {
      const timezoneMatch = text.match(/^[.!]time (.*)/i);

      if (timezoneMatch) {
        const timezoneQuery = this.abbreviationMap(timezoneMatch[1]);
        this.getTime(timezoneQuery).then((result) => {
          this.send(to, `${from}: ${result}`);
        });
      }
      return resolve();
    });
  }

  getTime(timezoneQuery) {
    return new Promise(resolve => {
      return resolve(timezone(new Date(), TIME_FORMAT, timezoneQuery));
    });
  }

  // Timezone abbreviations are ambiguous but I'm smarter than timezones
  abbreviationMap(abbr) {
    const abbrArray = [
      ['JST', 'Asia/Tokyo'],
      ['JAPAN', 'Asia/Tokyo'],
      ['JP', 'Asia/Tokyo'],
      ['EST', 'America/New_York'],
      ['EDT', 'America/New_York'],
      ['CST', 'America/Chicago'],
      ['CDT', 'America/Chicago'],
      ['PST', 'America/Los_Angeles'],
      ['PDT', 'America/Los_Angeles'],
    ];
    const abbrMap = new Map(abbrArray);
    return abbrMap.get(abbr.toUpperCase()) || abbr;
  }

  help(from, to) {
    this.send(to, `.time [timezone]; returns the current time. (Ex: .time JST).`);
  }
}
