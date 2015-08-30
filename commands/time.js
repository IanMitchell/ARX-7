/* Usage: .time [zone]
 * Ex: .time Asia/Beijing, .time JST
 */

import {Command} from './command.js';
var tz = require('timezone/loaded');

export class Time extends Command {
  message(from, to, text, message) {
    let timezoneMatch = text.match(/^[.!]time (.*)/);
    if(timezoneMatch) {
      let timezoneQuery = this.abbreviationMap(timezoneMatch[1]);
      this.getTime(timezoneQuery, (result) => {
        this.send(to, `${from}: ${result}`);
      });
    }
  }

  getTime(timezone, callback) {
    let formattedTime = tz(new Date(), "%c", timezone);
    callback(formattedTime);
  }

  // Timezone abbreviations are ambiguous but I'm smarter than timezones
  abbreviationMap(abbr) {
    let abbreviationToTimezone = {
      'JST': 'Asia/Tokyo',
      'EST': 'America/New_York',
      'EDT': 'America/New_York',
      'CST': 'America/Chicago',
      'CDT': 'America/Chicago',
      'PST': 'America/Los_Angeles',
      'PDT': 'America/Los_Angeles'
    };
    return abbreviationToTimezone[abbr] || abbr;
  }
}
