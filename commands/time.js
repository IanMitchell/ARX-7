/* Usage: .time [zone]
 * Ex: .time Asia/Beijing, .time JST
 */

import {Command} from './command.js';
import timezone from 'timezone/loaded';

export class Time extends Command {
  message(from, to, text, message) {
    let timezoneMatch = text.match(/^[.!]time (.*)/);
    return new Promise((resolve, reject) => {
      if(timezoneMatch) {
        let timezoneQuery = this.abbreviationMap(timezoneMatch[1]);
        this.getTime(timezoneQuery).then((result) => {
          this.send(to, `${from}: ${result}`);
        });
      }
      resolve();
    });
  }

  getTime(timezoneQuery) {
    return new Promise((resolve, reject) => {
      resolve(timezone(new Date(), "%c", timezoneQuery));
    })
  }

  // Timezone abbreviations are ambiguous but I'm smarter than timezones
  abbreviationMap(abbr) {
    let abbrArray = [
      ['JST', 'Asia/Tokyo'],
      ['EST', 'America/New_York'],
      ['EDT', 'America/New_York'],
      ['CST', 'America/Chicago'],
      ['CDT', 'America/Chicago'],
      ['PST', 'America/Los_Angeles'],
      ['PDT', 'America/Los_Angeles']
    ];
    let abbrMap = new Map(abbrArray);
    return abbrMap.get(abbr) || abbr;
  }
}
