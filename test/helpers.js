export class Client {
  constructor() {
    this.lastTarget = null;
    this.lastMessage = null;
    this.callback = null;
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
