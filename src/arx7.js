import debug from 'debug';
import irc from 'irc';
import config from '../config';

import {Choose} from './commands/choose.js';
import {Imgur} from './commands/imgur.js';
import {Order} from './commands/order.js';
import {Reply} from './commands/reply.js';
import {Time} from './commands/time.js';
import {Twitter} from './commands/twitter.js';
import {Youtube} from './commands/youtube.js';

let log = debug('ARX-7');
let droppedChannels = [];
let channels = config.channels.map(e => {
  if (!e.name.startsWith('#')) {
    e.name = `#${e.name}`;
  }
  return e.name.toLowerCase();
});

// Initialize the Bot
let client = new irc.Client(config.server, config.name, {
  userName: config.userName || "chidori",
  channels: channels
});

// Command List Setup
let commands = [
  new Choose(client),
  new Imgur(client),
  new Order(client),
  new Reply(client),
  new Time(client),
  new Twitter(client),
  new Youtube(client)
];

// On Server Connect
client.addListener('registered', (message) => {
  log('Connected to Server');
  client.say('NickServ', `identify ${config.password}`);
  log('Identified');
});

// Respond to Version requests
client.addListener('ctcp-version', (from, to, message) => {
  log(`CTCP request from ${from}`);
  client.ctcp(from, 'notice', `VERSION Bot running on node-irc.`);
});

// Listen for channel / personal Messages
client.addListener('message', (from, to, text, message) => {
  // Channels in Config
  if (channels.includes(to)) {
    commands.forEach(c => {
      let plugin = c.constructor.name.toLowerCase();

      if (config.channels[channels.indexOf(to)].plugins.includes(plugin)) {
        c.message(from, to, text, message);
      }
    });
  }

  // Queries
  if (to === client.nick) {
    // Check for Admin Queries
    if (config.admins.includes(from)) {
      log(`Admin Query from ${from}: ${text}`);
      let usage = `[add|remove] [plugin] [channel] [password]`;

      if (text.startsWith('add ') || text.startsWith('remove ')) {
        let args = text.split(/\s+/);

        if (args.length != 4) {
          client.say(from, `Not enough commands. ${usage}`);
          return;
        }

        if (args[3] !== config.adminPassword) {
          log(`Invalid Admin Password`);
          client.say(from, `Invalid password. ${usage}`);
          return;
        }

        if (config.channels[channels.indexOf(args[2].toLowerCase())]) {
          let exists = commands.some(c => {
            return c.constructor.name.toLowerCase() === args[1].toLowerCase();
          });

          if (exists) {
            if (args[0].toLowerCase() === 'add') {
              log(`ENABLE command for ${args[1]} in ${args[2]}`);
              let idx = config.channels[channels.indexOf(args[2].toLowerCase())].plugins.indexOf(args[1].toLowerCase());

              if (idx > -1) {
                client.say(from, `Plugin ${args[1]} already enabled.`);
              }
              else {
                config.channels[channels.indexOf(args[2].toLowerCase())].plugins.push(args[1].toLowerCase());
                log(`Enabled ${args[1]} from ${args[2]}`);
                client.say(from, `Enabled ${args[1]} for ${args[2]}`);
              }
            }
            else if (args[0].toLowerCase() === 'remove') {
              let idx = config.channels[channels.indexOf(args[2].toLowerCase())].plugins.indexOf(args[1].toLowerCase());
              config.channels[channels.indexOf(args[2].toLowerCase())].plugins.splice(idx, 1);
              log(`DISABLE command for ${args[1]} in ${args[2]}`);
              client.say(from, `Disabled ${args[1]} from ${args[2]}`);
            }
          }
          else {
            client.say(from, `Invalid plugin. ${usage}`);
          }
        }
        else {
          client.say(from, `Invalid channel. ${usage}`);
        }
      }
      else {
        client.say(from, `Command not recognized, boss. ${usage}`);
      }
    }
    // Respond to generic queries
    else {
      log(`Query from ${from}: ${text}`);
      client.say(from, "I'm a bot! Contact Desch, Jukey, or Aoi-chan for help");
    }
  }
});

// Praise the Creator
client.addListener('join', (channel, nick, message) => {
  if (nick === 'Desch' && channel == '#arx-7') {
    client.say(channel, 'Hello Master.');
  }
});

// Custom Auto-Rejoin
client.addListener('kick', (channel, nick, by, reason, message) => {
  if (nick === client.nick) {
    log(`Kicked from ${channel} by ${by}: ${reason}`);
    setTimeout(() => {
      log(`Rejoining ${channel}`);
      client.join(channel);
    }, 1000 * 3);
  }
});

client.addListener('error', message => {
  // Attempt to rejoin banned channels
  if (message.command == 'err_bannedfromchan') {
    log(`Banned from ${message.args[1]}. Rejoining in in 3 minutes`);

    // `()=>` ensures there is a delay; otherwise it continuously fires
    setTimeout(() => client.join(message.args[1]), 1000 * 60 * 3);
  }
  // Attempt to rejoin +k channels correctly
  else if (message.command == 'err_badchannelkey') {
    // Prevent infinite rejoin attempts
    if (droppedChannels.includes(message.args[1])) {
      log(`Incorrect password for ${message.args[1]}.`);
      return;
    }

    let key = config.channels[channels.indexOf(message.args[1])].key;

    if (key != null) {
      log(`${message.args[1]} is +k. Rejoining with password.`);
      client.join(`${message.args[1]} ${key}`);
      droppedChannels.push(message.args[1]);
    }
    else {
      log(`${message.args[1]} is +k. No key found. Skipping channel`);
    }
  }
  // Log other errors
  else {
    log(`ERROR: ${message.command}`);
  }
});
