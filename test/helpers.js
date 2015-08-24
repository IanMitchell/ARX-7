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
