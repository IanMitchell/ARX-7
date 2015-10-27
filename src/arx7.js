import debug from 'debug';
import pkg from '../package';

import {Choose}  from './commands/choose.js';
import {Imgur}   from './commands/imgur.js';
import {Order}   from './commands/order.js';
import {Reply}   from './commands/reply.js';
import {Time}    from './commands/time.js';
import {Twitter} from './commands/twitter.js';
import {Youtube} from './commands/youtube.js';

let log = debug('ARX-7');

const KICK_REJOIN_DELAY = 1000 * 3;
const BAN_RETRY_DELAY = 1000 * 60 * 3;

export class ARX7 {
  constructor(client, config) {
    this.commands = [
      new Choose(client),
      new Imgur(client),
      new Order(client),
      new Reply(client),
      new Time(client),
      new Twitter(client),
      new Youtube(client)
    ];

    this.client = client;
    this.config = config;
    this.droppedChannels = new Set();

    // Expand the config file
    this.config.channels = config.channels.map(c => {
      if (!c.name.startsWith('#')) {
        c.name = `#${c.name}`;
      }

      c.name = c.name.toLowerCase();

      if (c.key === undefined) {
        c.key = null;
      }

      if (c.plugins === undefined) {
        c.plugins = this.commands.map(o => o.constructor.name.toLowerCase());
      }

      return c;
    });

    this.channels = config.channels.map(c => c.name);
  }

  connect() {
    log('Connected to Server');
    this.client.say('NickServ', `identify ${this.config.password}`);
    log('Identified');

    if (this.config.mode) {
      log(`Setting mode +${this.config.mode}`);
      this.client.send('mode', this.client.nick, this.config.mode);
    }

    // Join channels
    for (let i = 0; i < this.channels.length; i++) {
      log(`Joining ${this.channels[i]}`);

      if (this.config.channels[i].key) {
        this.client.join(`${this.channels[i]} ${this.config.channels[i].key}`);
      }
      else {
        this.client.join(this.channels[i]);
      }
    }
  }

  version(from, to) {
    log(`CTCP request from ${from}`);
    this.client.ctcp(from, 'notice', `VERSION ARX-7 v${pkg.version} (Bot)`);
  }

  join(channel, nick) {
    // Correct incorrect config names
    if (this.channels.includes(channel.toLowerCase()) &&
        !this.channels.includes(channel)) {
      let idx = this.channels.indexOf(channel.toLowerCase());
      this.channels[idx] = channel;
    }

    // Joined channel, reset blacklist
    if (nick === this.client.nick) {
      this.droppedChannels.delete(channel);
    }
  }

  message(from, to, text) {
    if (this.channels.includes(to)) {
      this.commands.forEach(c => {
        let plugin = c.constructor.name.toLowerCase();
        let index = this.channels.indexOf(to);

        if (this.config.channels[index].plugins.includes(plugin)) {
          c.message(from, to, text);
        }
      });
    }

    // Handle Queries
    else if (to === this.client.nick && from !== this.client.nick) {
      if (this.config.admins.includes(from)) {
        this.handleAdminQuery(from, to, text);
      }
      else {
        log(`Query from ${from}: ${text}`);
        let admins = this.config.admins.join(', ');
        this.client.say(from, `I'm a bot! Contact [${admins}] for help`);
      }
    }
  }

  handleAdminQuery(from, to, text) {
    log(`Admin Query from ${from}: ${text}`);
    let usage = `[add|remove] [plugin] [channel] [password]`;
    let args = text.split(/\s+/);

    // We only support add/remove commands
    if (!(text.toLowerCase().startsWith('add ') ||
          text.toLowerCase().startsWith('remove '))) {
      log(`Unrecognized command`);
      this.client.say(from, `Command not recognized, boss. ${usage}`);
      return;
    }

    // Verify command format
    if (args.length != 4) {
      log(`Unrecognized command`);
      this.client.say(from, `Incorrect number of commands. ${usage}`);
      return;
    }

    // Verify Password
    if (args[3] !== this.config.adminPassword) {
      log(`Invalid Admin Password`);
      this.client.say(from, `Invalid password. ${usage}`);
      return;
    }

    let channel_index = this.channels.indexOf(args[2].toLowerCase());

    // Verify Channel Existence
    if (!this.config.channels[channel_index]) {
      log(`Invalid channel`);
      this.client.say(from, `Invalid channel. ${usage}`);
      return;
    }

    // Search and Verify Plugin Existence
    let exists = this.commands.some(c => {
      return c.constructor.name.toLowerCase() === args[1].toLowerCase();
    });

    if (!exists) {
      log(`Invalid plugin`);
      this.client.say(from, `Invalid plugin. ${usage}`);
      return;
    }

    // Add Plugin
    if (args[0].toLowerCase() === 'add') {
      log(`ENABLE command for ${args[1]} in ${args[2]}`);
      let plugin = args[1].toLowerCase();
      let idx = this.config.channels[channel_index].plugins.indexOf(plugin);

      if (idx > -1) {
        this.client.say(from, `Plugin ${args[1]} already enabled.`);
      }
      else {
        log(`Enabling ${args[1]} for ${args[2]}`);
        this.config.channels[channel_index].plugins.push(plugin);
        this.client.say(from, `Enabled ${args[1]} for ${args[2]}`);
      }
    }

    // Remove Plugin
    if (args[0].toLowerCase() === 'remove') {
      let plugin = args[1].toLowerCase();
      let idx = this.config.channels[channel_index].plugins.indexOf(plugin);

      if (idx > -1) {
        this.config.channels[channel_index].plugins.splice(idx, 1);

        log(`DISABLE command for ${args[1]} in ${args[2]}`);
        this.client.say(from, `Disabled ${args[1]} for ${args[2]}`);
      }
      else {
        this.client.say(from, `Plugin ${args[1]} already disabled.`);
      }
    }
  }

  kick(channel, nick, by, reason) {
    if (nick === this.client.nick) {
      log(`Kicked from ${channel} by ${by}: ${reason}`);
      setTimeout(() => {
        log(`Rejoining ${channel}`);
        this.client.join(channel);
      }, KICK_REJOIN_DELAY);
    }
  }

  error(message) {
    if (message.command == 'err_bannedfromchan') {
      log(`Banned from ${message.args[1]}. Rejoining in in 3 minutes`);

      // `()=>` ensures there is a delay; otherwise it continuously fires
      setTimeout(() => this.client.join(message.args[1]), BAN_RETRY_DELAY);
    }
    // Attempt to rejoin +k channels correctly
    else if (message.command == 'err_badchannelkey') {
      // Prevent infinite rejoin attempts
      if (this.droppedChannels.has(message.args[1])) {
        log(`Incorrect password for ${message.args[1]}.`);
        return;
      }

      let idx = this.channels.indexOf(message.args[1]);
      let key = this.config.channels[idx].key;

      if (key !== null) {
        log(`${message.args[1]} is +k. Rejoining with password.`);
        this.client.join(`${message.args[1]} ${key}`);
        this.droppedChannels.add(message.args[1]);
      }
      else {
        log(`${message.args[1]} is +k. No key found. Skipping channel`);
      }
    }
    // Log other errors
    else {
      log(`ERROR: ${message.command}`);
    }
  }
}
