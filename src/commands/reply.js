import debug from 'debug';
import { Command } from './command.js';

const log = debug('Reply');

export class Reply extends Command {
  constructor(client) {
    super(client);
    this.responses = new Map();
    this.responses.set('ping', 'pong');
    this.responses.set('bot respond', "I'm a pretty stupid bot.");
    this.responses.set('bot be nice', 'sorry :(');
    this.responses.set('gj bot', 'thx');
    this.responses.set('thx bot', 'np');
    this.responses.set('bot pls', '( ¬‿¬)');
    this.responses.set('!bugreport', 'Hi! To file a feature request or bug, go to: https://github.com/IanMitchell/ARX-7');
    this.responses.set('.blame', 'Please use: ".blame <show>" (ie, `.blame bokumachi`)');
  }

  message(from, to, text) {
    return new Promise(resolve => {
      const reply = this.responses.get(text.toLowerCase());
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
