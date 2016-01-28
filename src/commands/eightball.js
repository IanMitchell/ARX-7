import debug from 'debug';
import { Command } from './command.js';

const log = debug('Eightball');

export class Eightball extends Command {
  constructor(client) {
    super(client);

    this.responses = [
      'It is certain',
      'It is decidedly so',
      'Without a doubt',
      'Yes, definitely',
      'You may rely on it',
      'As I see it, yes',
      'Most likely',
      'Outlook good',
      'Yes',
      'Signs point to yes',
      'Reply hazy try again',
      'Ask again later',
      'Better not tell you now',
      'Cannot predict now',
      'Concentrate and ask again',
      "Don't count on it",
      'My reply is no',
      'My sources say no',
      'Outlook not so good',
      'Very doubtful',
    ];
  }

  message(from, to, text) {
    if (text.startsWith('.8ball ')) {
      log(`${from} on: ${text}`);

      const result = this.responses[Math.floor(Math.random() * this.responses.length)];
      this.send(to, `${from}: ${result}`);
    }
  }

  help(from) {
    this.client.notice(from, `.8ball question; randomly outputs response`);
  }
}
