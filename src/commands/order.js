import debug from 'debug';
import {Command} from './command.js';

let log = debug('Order');
const ORDER_LIMIT = 20;

export class Order extends Command {
  message(from, to, text, message) {
    return new Promise((resolve, reject) => {
      let order_regex = /^[.!]o(?:rder)? (.+)$/;
      let order = text.match(order_regex);

      if (order) {
        let range_regex = /(-?\d+)-(-?\d+)$/;
        let range = text.match(range_regex);

        if (range) {
          let result = this.orderRange(range);
          this.send(to, `${from}: ${result}`);
          resolve();
        }
        else {
          let result = this.orderList(order[1]);
          this.send(to, `${from}: ${result}`);
          resolve();
        }
      }

      resolve();
    });
  }

  orderRange(order) {
    log(`Ordering Range: ${order}`);
    let min = Math.min(parseInt(order[1]), parseInt(order[2])),
        max = Math.max(parseInt(order[1]), parseInt(order[2]));

    order[1] = Math.min(max, min + 9);
    let choices = this.getRange(min, max);
    return choices.join(', ');
  }

  getRange(lowerBound, upperBound) {
    let results = [];
    let capped = false;

    for (let i = lowerBound; i < upperBound + 1; i++) {
      results.push(i.toString());

      if (i - ORDER_LIMIT > lowerBound) {
        capped = true;
        break;
      }
    }

    if (capped) {
      results = this.shuffleArray(results);
      results.push('And some more...');
      return results;
    }
    else {
      return this.shuffleArray(results);
    }
  }

  orderList(text) {
    log(`Ordering List: ${text}`);
    let choices = this.getChoices(text, ',');

    if (choices) {
      if (choices.length == 1) {
        choices = this.getChoices(text, ' ');
      }

      choices = this.shuffleArray(choices);
      return choices.join(', ');
    }
    else {
      return 'No choices to choose from';
    }
  }

  shuffleArray(array) {
    let currentIndex = array.length,
        temporaryValue = 0,
        randomIndex = 0;

    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
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
}
