import debug from 'debug';
import { Command } from './command.js';

const log = debug('Same');

export const MESSAGE_STACK_SIZE = 4;

export class Same extends Command {
  constructor(client) {
    super(client);
    this.messageStack = new Map();
  }

  message(from, to, text) {
    this.pushMessage(to, text);

    if (this.isSame(to, text)) {
      log(`Sending ${text}`);
      this.send(to, text);
      this.messageStack.set(to, []);
    }
  }

  pushMessage(channel, text) {
    if (!this.messageStack.get(channel)) {
      log(`Creating entry for ${channel}`);
      this.messageStack.set(channel, []);
    }

    this.messageStack.get(channel).push(text);

    // Only track last couple messages
    if (this.messageStack.get(channel).length > MESSAGE_STACK_SIZE) {
      this.messageStack.get(channel).shift();
    }
  }

  // Reduces array to only unique values
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  isSame(channel, message) {
    if (!this.messageStack.get(channel)) {
      return false;
    }

    if (this.messageStack.get(channel).length !== MESSAGE_STACK_SIZE) {
      return false;
    }

    const unique = this.messageStack.get(channel).filter(this.onlyUnique);

    if (unique.length === 1 && unique[0] === message) {
      return true;
    }

    return false;
  }

  help(from) {
    this.client.notice(from, `Same automatically responds to certain phrases.`);
  }
}
