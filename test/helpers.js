export class Client {
  constructor() {
    this.lastTarget = null;
    this.lastMessage = null;
  }

  say(target, message) {
    this.lastTarget = target;
    this.lastMessage = message;
  }

  resetLog() {
    this.lastTarget = null;
    this.lastMessage = null;
  }
}

export class Command {
  constructor(client) {
    this.client = client;
  }

  message(from, to, text, message) {
    this.client.say(to, text);
  }
}

export class Choose extends Command {}
export class Imgur extends Command {}
export class Order extends Command {}
export class Reply extends Command {}
export class Twitter extends Command {}
export class Youtube extends Command {}
