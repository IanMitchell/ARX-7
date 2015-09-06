export class Client {
  constructor() {
    this.lastTarget = null;
    this.lastMessage = null;
    this.lastType = null;
  }

  say(target, message) {
    this.lastTarget = target;
    this.lastMessage = message;
  }

  ctcp(to, type, message) {
    this.lastType = type;
    this.say(to, message);
  }

  resetLog() {
    this.lastTarget = null;
    this.lastMessage = null;
    this.lastType = null;
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
