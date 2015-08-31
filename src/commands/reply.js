import debug from 'debug';
import {Command} from './command.js';

let log = debug('Reply');

export class Reply extends Command {
  message(from, to, text, message) {
    return new Promise((resolve, reject) => {
      if (text.toLowerCase() === 'ping') {
        log(`${from} ping reply`);
        this.send(to, 'pong');
        resolve();
      }

      if (text.toLowerCase() === 'bot respond') {
        log(`${from} respond reply`);
        this.send(to, "I'm a pretty stupid bot.");
        resolve();
      }

      if (text.toLowerCase() === 'bot be nice') {
        log(`${from} apology reply`);
        this.send(to, "sorry :(");
        resolve();
      }

      if (text.toLowerCase() === 'gj bot') {
        log(`${from} congrats reply`);
        this.send(to, "thx");
        resolve();
      }

      resolve();
    });
  }
}
