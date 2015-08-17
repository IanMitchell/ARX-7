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
}
