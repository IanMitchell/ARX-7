import {Command} from './command.js';

const ORDER_LIMIT = 20;

export class Order extends Command {
  message(from, to, text, message) {
    let order_regex = /^[.!]o(?:rder)? (.+)$/;
    let order = text.match(order_regex);

    if (order) {
      if (this.checkBlacklist(text)) {
        this.client.say(to, 'Nope.');
      }
      else {
        console.log('Order command received');
        let range_regex = /(-?\d+)-(-?\d+)$/;
        let range = text.match(range_regex);

        if (range) {
          console.log("Range request");
          let result = this.orderRange(range);
          this.client.say(to, `${from}: ${result}`);
        }
        else {
          let result = this.orderList(order[1]);
          this.client.say(to, `${from}: ${result}`);
        }
      }
    }
  }

  orderRange(order) {
    let min = Math.min(parseInt(order[1]), parseInt(order[2])),
        max = Math.max(parseInt(order[1]), parseInt(order[2]));
    console.log(`Min: ${min}, Max: ${max}`);
    order[1] = Math.min(max, min + 9);
    console.log(order);
    let choices = this.getRange(min, max);
    console.log(choices);
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

  checkBlacklist(message) {
    let triggered = false;

    this.blacklist.forEach(k => {
      if (message.toLowerCase().includes(k.toLowerCase())) {
        console.log('Choose Blacklist triggered');
        triggered = true;
      }
    });

    return triggered;
  }
}
