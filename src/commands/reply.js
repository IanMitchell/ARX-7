import debug from 'debug';
import { Command } from './command.js';

const log = debug('Reply');

export class Reply extends Command {
  message(from, to, text) {
    return new Promise(resolve => {
      const responses = new Map();
      responses.set('ping', 'pong');
      responses.set('bot respond', "I'm a pretty stupid bot.");
      responses.set('bot be nice', 'sorry :(');
      responses.set('gj bot', 'thx');
      responses.set('thx bot', 'np');
      responses.set('bot pls', '( ¬‿¬)');
      responses.set('!bugreport', 'Hi! To file a feature request or bug, go to: https://github.com/IanMitchell/ARX-7');

      const reply = responses.get(text.toLowerCase());
      if (reply) {
        log(`${from} ${reply} reply`);
        this.send(to, reply);
      }

      return resolve();
    });
  }

  help(from) {
    this.client.notice(from, `Reply automatically responds to certain phrases.`);
  }
}
