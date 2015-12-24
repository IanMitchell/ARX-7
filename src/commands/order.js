import debug from 'debug';
import { Command } from './command.js';

const log = debug('Order');

export const ORDER_MAX_VALUE = 99999999999;
export const ORDER_RANGE_LIMIT = 1024;
export const ORDER_RESULTS_LIMIT = 20;

export class Order extends Command {
  message(from, to, text) {
    return new Promise(resolve => {
      const orderRegex = /^[.!]o(?:rder)? (.+)$/i;
      const order = text.match(orderRegex);

      if (order) {
        const rangeRegex = /(-?\d+)-(-?\d+)$/i;
        const range = text.match(rangeRegex);

        if (range) {
          log(`${from} on: ${range}`);
          const result = this.orderRange(range);
          this.send(to, `${from}: ${result}`);
          return resolve();
        }

        log(`${from} on: ${order[1]}`);
        const result = this.orderList(order[1]);
        this.send(to, `${from}: ${result}`);
        return resolve();
      }

      return resolve();
    });
  }

  orderRange(order) {
    const min = Math.min(parseInt(order[1], 10), parseInt(order[2], 10));
    const max = Math.max(parseInt(order[1], 10), parseInt(order[2], 10));

    if (min >= ORDER_MAX_VALUE || max >= ORDER_MAX_VALUE) {
      return 'Value is too high.';
    }

    const choices = this.getRange(min, max);
    return choices.join(', ');
  }

  getRange(lowerBound, upperBound) {
    let results = new Array();
    let capped = false;
    let correctedUpperBound = upperBound;

    if (upperBound - lowerBound > ORDER_RANGE_LIMIT) {
      correctedUpperBound = lowerBound + ORDER_RANGE_LIMIT;
    }

    for (let i = lowerBound; i <= correctedUpperBound; i++) {
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

    return 'No choices to choose from';
  }

  shuffleArray(array) {
    let temp = 0;

    for (let i = array.length - 1; i >= 0; i--) {
      const idx = Math.floor(Math.random() * (array.length - i)) + i;
      temp = array[i];
      array[i] = array[idx];
      array[idx] = temp;
    }

    return array;
  }

  getChoices(input, delimiter) {
    const choices = new Array();

    input.split(delimiter).forEach(choice => {
      const val = choice.trim();
      if (val) {
        choices.push(val);
      }
    });

    return choices;
  }

  help(from, to) {
    this.send(to, `.o[rder] [options...]; randomly arranges the list. (Ex: .o s, n, i, p, e).`);
  }
}
