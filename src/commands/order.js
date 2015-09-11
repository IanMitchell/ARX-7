import debug from 'debug';
import {Command} from './command.js';

let log = debug('Order');

export const ORDER_RANGE_LIMIT = 1024;
export const ORDER_RESULTS_LIMIT = 20;

export class Order extends Command {
  message(from, to, text, message) {
    return new Promise((resolve, reject) => {
      let order_regex = /^[.!]o(?:rder)? (.+)$/;
      let order = text.match(order_regex);

      if (order) {
        let range_regex = /(-?\d+)-(-?\d+)$/;
        let range = text.match(range_regex);

        if (range) {
          log(`${from} on: ${range}`);
          let result = this.orderRange(range);
          this.send(to, `${from}: ${result}`);
          resolve();
        }
        else {
          log(`${from} on: ${order[1]}`);
          let result = this.orderList(order[1]);
          this.send(to, `${from}: ${result}`);
          resolve();
        }
      }

      resolve();
    });
  }

  orderRange(order) {
    let min = Math.min(parseInt(order[1]), parseInt(order[2])),
        max = Math.max(parseInt(order[1]), parseInt(order[2]));

    let choices = this.getRange(min, max);
    return choices.join(', ');
  }

  getRange(lowerBound, upperBound) {
    let results = [],
        capped = false;

    if (upperBound - lowerBound > ORDER_RANGE_LIMIT) {
      upperBound = lowerBound + ORDER_RANGE_LIMIT;
    }

    for (let i = lowerBound; i <= upperBound; i++) {
      if (i - lowerBound > ORDER_RESULTS_LIMIT) {
        capped = true;
      }

      results.push(i.toString());
    }

    results = this.shuffleArray(results);

    if (capped) {
      results = results.splice(0, ORDER_RESULTS_LIMIT);
      results.push('and some more...');
    }

    return results;
  }

  orderList(text) {
    let choices = this.getChoices(text, ',');

    if (choices) {
      if (choices.length <= 1) {
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
