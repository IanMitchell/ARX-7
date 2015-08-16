import irc from 'irc';
import config from './config';

import {Choose} from './commands/choose.js';
import {Debug} from './commands/debug.js';
import {Youtube} from './commands/youtube.js';


// Initialize the Bot
let client = new irc.Client(config.server, config.name, {
  channels: config.channels
});

// Command List Setup
let commands = [
  new Choose(client),
  new Debug(client),
  new Youtube(client)
]

// On Server Connect
client.addListener('registered', (message) => {
  console.log('Connected to Server');
  client.say('NickServ', `identify ${config.password}`);
  console.log('Identified');
});

// Respond to Version requests
client.addListener('ctcp-version', (from, to, message) => {
  console.log(`CTCP request from ${from}`);
  client.ctcp(from, 'notice', `VERSION Bot running on node-irc.`);
});

// Praise the Creator
client.addListener('join', (channel, nick, message) => {
  if (nick === 'Desch') {
    client.say(channel, 'Hello Master.');
  }
});

// Listen for channel / personal Messages
client.addListener('message', (from, to, text, message) => {
  commands.forEach(c => c.message(from, to, text, message));
});

// Something happened. If we don't log it, the app will crash
client.addListener('error', message => console.log(`Error: ${message.command}`));
