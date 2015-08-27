import debug from 'debug';
import {Command} from './command.js';

let log = debug('Reply');

export class Reply extends Command {
  message(from, to, text, message) {
    return new Promise((resolve, reject) => {
      if (text.toLowerCase() === 'ping') {
        log('Ping Reply');
        this.send(to, 'pong');
        resolve();
      }

      if (text.toLowerCase() === 'bot respond') {
        log('Respond Reply');
        this.send(to, "I'm a pretty stupid bot.");
        resolve();
      }

      if (text.toLowerCase() === 'bot be nice') {
        log('Apology Reply');
        this.send(to, "sorry :(");
        resolve();
      }

      if (text.toLowerCase() === 'gj bot') {
        log('Congrats Reply');
        this.send(to, "thx");
        resolve();
      }

      resolve();
    });
  }
}
