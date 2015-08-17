export class Command {
  constructor(c) {
    this.client = c;

    this.blacklist = [
      'XD',
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

  checkBlacklist(message) {
    let triggered = false;

    this.blacklist.forEach(k => {
      if (message.toLowerCase().includes(k.toLowerCase())) {
        console.log('Choose Blacklist triggered');
        triggered = true;
      }
    });

    return triggered;
  }
}
