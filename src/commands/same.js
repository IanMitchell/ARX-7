import debug from 'debug';
import { Command } from './command.js';

const log = debug('Same');
const MESSAGE_STACK_SIZE = 3;

export class Same extends Command {
  constructor(client) {
    super(client);
    this.messageStack = [];
  }

  message(from, to, text) {
    return new Promise(resolve => {
      if (this.isSame(to, text)) {
        log(`Sending ${text}`);
        this.send(to, text);
        this.messageStack[to] = [];
        return resolve();
      }

      this.pushMessage(to, text);
      return resolve();
    });
  }

  pushMessage(channel, text) {
    if (!this.messageStack.includes(channel)) {
      log(`Creating entry for ${channel}`);
      this.messageStack.push(channel);
      this.messageStack[channel] = [];
    }

    this.messageStack[channel].push(text);

    if (this.messageStack[channel].length > MESSAGE_STACK_SIZE) {
      this.messageStack[channel].shift();
    }
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  isSame(channel, message) {
    if (!this.messageStack.includes(channel)) {
      return false;
    }

    if (this.messageStack[channel].length !== MESSAGE_STACK_SIZE) {
      return false;
    }

    const unique = this.messageStack[channel].filter(this.onlyUnique);

    if (unique.length === 1 && unique[0] === message) {
      return true;
    }

    return false;
  }

  help(from) {
    this.client.notice(from, `Same automatically responds to certain phrases.`);
  }
}
