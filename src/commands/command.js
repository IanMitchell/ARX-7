import debug from 'debug';

let log = debug('Command');

export class Command {
  constructor(c) {
    this.client = c;

    this.blacklist = [
      ' XD ',
      'attention attention',
      'scion',
      'touhou',
      'erep',
      'esim',
      'republik',
      'cereal ceral',
      '!sw',
      '!loli',
      'tinyurl',
      '4294967295',
      '4294967294'
    ];
  }

  message(to, from, text, message) { }

  send(to, text) {
    if (this.checkBlacklist(text)) {
      this.client.say(to, 'Nope.');
    } else {
      this.client.say(to, text);
    }
  }

  checkBlacklist(message) {
    let triggered = false;

    this.blacklist.forEach(k => {
      if (message.toLowerCase().includes(k.toLowerCase())) {
        log(`Blacklist triggered on "${k}"`);
        triggered = true;
      }
    });

    return triggered;
  }
}
