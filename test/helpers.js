export class Client {
  constructor(callback) {
    this.lastTarget = null;
    this.lastMessage = null;
    this.callback = null;
  }

  setCallback(callback) {
    this.callback = callback;
  }

  say(target, message) {
    this.lastTarget = target;
    this.lastMessage = message;

    if (this.callback) {
      this.callback();
    }
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
