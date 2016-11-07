import debug from 'debug';
import pkg from '../package.json';

import { Choose } from './commands/choose';
import { Eightball } from './commands/eightball';
import { Order } from './commands/order';
import { Reply } from './commands/reply';
import { Same } from './commands/same';
import { ShowtimesAiring } from './commands/showtimes_airing';
import { ShowtimesBlame } from './commands/showtimes_blame';
import { ShowtimesNext } from './commands/showtimes_next';
import { ShowtimesRelease } from './commands/showtimes_release';
import { ShowtimesStaff } from './commands/showtimes_staff';
import { Time } from './commands/time';
import { Twitter } from './commands/twitter';

const log = debug('ARX-7');

const KICK_REJOIN_DELAY = 1000 * 3;
const BAN_RETRY_DELAY = 1000 * 60 * 3;

export class ARX7 {
  constructor(client, config) {
    this.commands = [
      new Choose(client),
      new Eightball(client),
      new Order(client),
      new Reply(client),
      new Same(client),
      new ShowtimesAiring(client),
      new ShowtimesBlame(client),
      new ShowtimesNext(client),
      new ShowtimesRelease(client, this.isAuthorized),
      new ShowtimesStaff(client, this.isAuthorized),
      new Time(client),
      new Twitter(client),
    ];

    this.client = client;
    this.config = config;
    this.droppedChannels = new Set();

    // Expand the config file
    this.config.channels = config.channels.map(channel => {
      if (!channel.name.startsWith('#')) {
        channel.name = `#${channel.name}`;
      }

      channel.name = channel.name.toLowerCase();

      if (channel.key === undefined) {
        channel.key = null;
      } else {
        channel.key = process.env[channel.name.substr(1).toUpperCase()];
      }

      if (channel.plugins === undefined) {
        channel.plugins = this.commands.map(command => {
          return command.constructor.name.toLowerCase();
        });
      }

      return channel;
    });

    this.channels = config.channels.map(channel => channel.name);
  }

  connect() {
    log('Connected to Server');
    this.client.say('NickServ', `identify ${process.env.ARX7_PASS}`);
    log('Identified');

    if (this.config.mode) {
      log(`Setting mode +${this.config.mode}`);
      this.client.send('mode', this.client.nick, this.config.mode);
    }

    // Join channels
    this.config.channels.forEach(channel => {
      log(`Joining ${channel.name}`);

      if (channel.key) {
        this.client.join(`${channel.name} ${channel.key}`);
      } else {
        this.client.join(channel.name);
      }
    });
  }

  version(from) {
    log(`CTCP request from ${from}`);
    this.client.ctcp(from, 'notice', `VERSION ARX-7 v${pkg.version} (Bot)`);
  }

  join(channel, nick) {
    // Correct incorrect config names
    if (this.channels.includes(channel.toLowerCase()) &&
        !this.channels.includes(channel)) {
      const idx = this.channels.indexOf(channel.toLowerCase());
      this.channels[idx] = channel;
    }

    // Joined channel, reset blacklist
    if (nick === this.client.nick) {
      this.droppedChannels.delete(channel);
    }
  }

  message(from, to, text) {
    if (this.channels.includes(to)) {
      // Command Handling
      this.commands.forEach(command => {
        const plugin = command.constructor.name.toLowerCase();
        const index = this.channels.indexOf(to);

        if (this.config.channels[index].plugins.includes(plugin)) {
          command.message(from, to, text);
        }
      });
    } else if (to === this.client.nick && from !== this.client.nick) {
      // Query Handling
      if (this.config.admins.includes(from)) {
        return this.handleAdminQuery(from, to, text);
      } else {
        log(`Query from ${from}: ${text}`);
        const admins = this.config.admins.join(', ');
        this.client.say(from, `I'm a bot! Contact [${admins}] for help. For help using me, use '.guide'.`);
      }
    }

    this.helpRequest(from, to, text);
  }

  helpRequest(from, to, text) {
    const helpRegex = /^[.!](?:g(?:uide)?)(?:\s(.+))?$/i;
    const help = text.match(helpRegex);

    if (help) {
      if (help[1] === undefined) {
        log(`Help request from ${from}`);
        const str = `Syntax: .guide [module]. Modules: ${this.moduleList()}.`;
        this.client.notice(from, str);
      } else {
        log(`Request from ${from} on ${help[1]}`);
        this.commands.forEach(command => {
          const plugin = command.constructor.name.toLowerCase();

          if (help[1] === plugin) {
            command.help(from, to);
          }
        });
      }
    }
  }

  isAuthorized(username) {
    return new Promise(resolve => {
      const callbackWrapper = (from, to, text) => {
        log(`NOTICE ${from}: ${text}`);

        if (text.startsWith(`STATUS ${username}`)) {
          this.client.removeListener('notice', callbackWrapper);
          return resolve(parseInt(text[text.length - 1], 10) > 1);
        }
      };

      this.client.addListener('notice', callbackWrapper);
      this.client.say('NickServ', `status ${username}`);
    });
  }

  handleAdminQuery(from, to, text) {
    log(`Admin Query from ${from}: ${text}`);
    const usage = `[add|remove] [plugin] [channel]`;
    const args = text.split(/\s+/);

    // We only support add/remove commands
    if (!(text.toLowerCase().startsWith('add ') ||
          text.toLowerCase().startsWith('remove '))) {
      log(`Unrecognized command`);
      this.client.say(from, `Command not recognized, boss. ${usage}`);
      return true;
    }

    // Verify command format
    if (args.length !== 3) {
      log(`Unrecognized command`);
      this.client.say(from, `Incorrect number of commands. ${usage}`);
      return false;
    }

    // Verify Authorization
    return this.isAuthorized(from).then(status => {
      if (status === false) {
        log(`${from} is not identified.`);
        this.client.say(from, `You are not identified.`);
        return true;
      }

      const channelIndex = this.channels.indexOf(args[2].toLowerCase());

      // Verify Channel Existence
      if (!this.config.channels[channelIndex]) {
        log(`Invalid channel`);
        this.client.say(from, `Invalid channel. ${usage}`);
        return true;
      }

      // Search and Verify Plugin Existence
      const exists = this.commands.some(command => {
        return command.constructor.name.toLowerCase() === args[1].toLowerCase();
      });

      if (!exists) {
        log(`Invalid plugin`);
        this.client.say(from, `Invalid plugin. ${usage}`);
        return true;
      }

      // Add Plugin
      if (args[0].toLowerCase() === 'add') {
        log(`ENABLE command for ${args[1]} in ${args[2]}`);
        const plugin = args[1].toLowerCase();
        const idx = this.config.channels[channelIndex].plugins.indexOf(plugin);

        if (idx > -1) {
          this.client.say(from, `Plugin ${args[1]} already enabled.`);
          return true;
        }

        log(`Enabling ${args[1]} for ${args[2]}`);
        this.config.channels[channelIndex].plugins.push(plugin);
        this.client.say(from, `Enabled ${args[1]} for ${args[2]}`);
        return true;
      }

      // Remove Plugin
      if (args[0].toLowerCase() === 'remove') {
        const plugin = args[1].toLowerCase();
        const idx = this.config.channels[channelIndex].plugins.indexOf(plugin);

        if (idx > -1) {
          this.config.channels[channelIndex].plugins.splice(idx, 1);

          log(`DISABLE command for ${args[1]} in ${args[2]}`);
          this.client.say(from, `Disabled ${args[1]} for ${args[2]}`);
          return true;
        }

        this.client.say(from, `Plugin ${args[1]} already disabled.`);
        return true;
      }
    });
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
    if (message.command === 'err_bannedfromchan') {
      log(`Banned from ${message.args[1]}. Rejoining in in 3 minutes`);

      // Passing a function ensures there is a delay,
      // otherwise it continuously fires
      setTimeout(() => this.client.join(message.args[1]), BAN_RETRY_DELAY);
    } else if (message.command === 'err_badchannelkey') {
      // Attempt to rejoin +k channels correctly
      // Prevent infinite rejoin attempts
      if (this.droppedChannels.has(message.args[1])) {
        log(`Incorrect password for ${message.args[1]}.`);
        return;
      }

      const idx = this.channels.indexOf(message.args[1]);
      const key = this.config.channels[idx].key;

      if (key !== null) {
        log(`${message.args[1]} is +k. Rejoining with password.`);
        this.client.join(`${message.args[1]} ${key}`);
        this.droppedChannels.add(message.args[1]);
      } else {
        log(`${message.args[1]} is +k. No key found. Skipping channel`);
      }
    } else {
      // Log other errors
      log(`ERROR: ${message.command}`);
    }
  }

  moduleList() {
    const list = this.commands.map(command => command.constructor.name.toLowerCase());
    return list.join(', ');
  }
}
