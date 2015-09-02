import debug from 'debug';
import {Command} from './command.js';

let log = debug('Choose');

export class Choose extends Command {
  message(from, to, text, message) {
    return new Promise((resolve, reject) => {
      let regex = /^\.(?:(?:c(?:hoose)?)|(?:erande)|(?:選んで)|(?:選ぶがよい)) (.+)/;
      let choose = text.match(regex);

      if (choose) {
        log(`${from} on: ${choose[1]}`);
        
        let result = this.choose(choose[1]);
        this.send(to, `${from}: ${result}`);
      }

      resolve();
    });
  }

  choose(input) {
    let range_regex = /^(-?\d+(\.\d+)?)-(-?\d+(\.\d+)?)$/;
    let range = input.match(range_regex);

    // Choose from a range (.c 1-100)
    if (range) {
      let min = Math.min(parseFloat(range[1]), parseFloat(range[3]));
      let max = Math.max(parseFloat(range[1]), parseFloat(range[3]));

      // Range of Floats
      if (range[2] || range[4]) {
        let decimals = Math.min(Math.max(
                        this.countDecimals(range[1]),
                        this.countDecimals(range[3])
                      ), 19);

        return (min + Math.random() * (max - min)).toFixed(decimals);
      }
      // Range of Integers
      else {
        // Add +1 so that the upperbound is included
        return Math.floor(min + Math.random() * (max - min + 1));
      }
    }
    // Choose from list delimited by ',' or ' '
    else {
      let choices = this.getChoices(input, ',');

      if (choices) {
        // Check for space delimiter
        if (choices.length == 1) {
          choices = this.getChoices(input, ' ');
        }

        return choices[Math.floor(Math.random() * choices.length)];
      }
      else {
        return 'No choices to choose from';
      }
    }
  }

  getChoices(input, delimiter) {
    let choices = [];

    input.split(delimiter).forEach(k => {
      let v = k.trim();
      if (v) {
        choices.push(v);
      }
    });

    return choices;
  }

  countDecimals(number) {
    if (Math.floor(number) == number && !number.toString().includes('.')) {
      return 0;
    }

    return number.toString().split('.')[1].length || 0;
  }
}
