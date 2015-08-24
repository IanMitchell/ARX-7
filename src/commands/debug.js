import {Command} from './command.js';

export class Debug extends Command {
  message(from, to, text, message) {
    if (text.toLowerCase() === 'ping') {
      this.send(to, 'pong');
    }

    if (text.toLowerCase() === 'bot respond') {
      this.send(to, "I'm a pretty stupid bot.");
    }

    if (text.toLowerCase() === 'bot be nice') {
      this.send(to, "sorry :(");
    }

    if (text.toLowerCase() === 'gj bot') {
      this.send(to, "thx");
    }
  }
}
