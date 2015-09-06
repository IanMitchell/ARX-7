export class Client {
  constructor() {
    this.lastTarget = null;
    this.lastMessage = null;
    this.lastType = null;
    this.channelLog = [];
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

  join(channel) {
    this.channelLog.push(channel);
  }

  getLastChannel() {
    return this.channelLog[this.channelLog.length - 1];
  }

  resetChannels() {
    this.channelLog = [];
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
