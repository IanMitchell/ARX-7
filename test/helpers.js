import config from './test_config';

export class Client {
  constructor() {
    this.lastTarget = null;
    this.lastMessage = null;
    this.lastType = null;
    this.channelLog = [];

    this.nick = config.name;
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

  message(from, to, text) {
    this.client.say(to, text);
  }
}

class CommandMock extends Command {
  constructor(client) {
    super(client);
    this.log = [];
  }

  message(from, to, text) {
    super.message(from, to, text);
    this.log.push(text);
  }

  clearHistory() {
    this.log = [];
  }
}

export class Choose extends CommandMock {}
export class Imgur extends CommandMock {}
export class Order extends CommandMock {}
export class Reply extends CommandMock {}
export class Time extends CommandMock {}
export class Twitter extends CommandMock {}
export class Youtube extends CommandMock {}
