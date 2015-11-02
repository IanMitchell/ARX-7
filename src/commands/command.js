import debug from 'debug';

const log = debug('Command');

export class Command {
  constructor(client) {
    this.client = client;
    this.wholeWordBlacklist = [
      'xd',
    ];

    this.blacklist = [
      '.ly',
      '!loli',
      '!sw',
      '!fish',
      '.lewd',
      'cooldudeirc',
      'valbot',
    ];
  }

  // Pseudo interface
  message() {
    return;
  }

  send(to, text) {
    if (this.checkBlacklist(text)) {
      this.client.say(to, 'Blacklist triggered.');
    } else {
      this.client.say(to, text);
    }
  }

  checkBlacklist(message) {
    for (const badword of this.blacklist) {
      if (message.toLowerCase().includes(badword)) {
        log(`Blacklist triggered on "${badword}"`);
        return true;
      }
    }

    for (const badword of this.wholeWordBlacklist) {
      for (const word of message.split(/\s+/)) {
        if (word.toLowerCase() === badword) {
          log(`Blacklist triggered on "${badword}"`);
          return true;
        }
      }
    }

    return false;
  }
}
