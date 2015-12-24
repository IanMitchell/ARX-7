import debug from 'debug';
import { Command } from './command.js';

const log = debug('Reply');

export class Reply extends Command {
  message(from, to, text) {
    return new Promise(resolve => {
      if (text.toLowerCase() === 'ping') {
        log(`${from} ping reply`);
        this.send(to, 'pong');
        return resolve();
      }

      if (text.toLowerCase() === 'bot respond') {
        log(`${from} respond reply`);
        this.send(to, "I'm a pretty stupid bot.");
        return resolve();
      }

      if (text.toLowerCase() === 'bot be nice') {
        log(`${from} apology reply`);
        this.send(to, 'sorry :(');
        return resolve();
      }

      if (text.toLowerCase() === 'gj bot') {
        log(`${from} congrats reply`);
        this.send(to, 'thx');
        return resolve();
      }

      if (text.toLowerCase() === 'thx bot') {
        log(`${from} thanks reply`);
        this.send(to, 'np');
        return resolve();
      }

      if (text.toLowerCase() === 'bot pls') {
        log(`${from} please reply`);
        this.send(to, '( ¬‿¬)');
        return resolve();
      }

      return resolve();
    });
  }

  help(from, to) {
    this.send(to, `Reply automatically responds to certain phrases.`);
  }
}
