import debug from 'debug';
import irc from 'irc';
import config from '../config';
import {ARX7} from './arx7.js';

let log = debug('Bot');

// Initialize the Bot
let client = new irc.Client(config.server.split(':')[0], config.name, {
  userName: config.userName || "chidori",
  port: config.server.split(':')[1] || 6667,
  stripColors: true
});

let arx7 = new ARX7(client, config);

// On Server Connect
client.addListener('registered', (message) => {
  arx7.connect(message);
});

// Respond to Version requests
client.addListener('ctcp-version', (from, to, message) => {
  arx7.version(from, to, message);
});

// Listen for channel / personal Messages
client.addListener('message', (from, to, text, message) => {
  arx7.message(from, to, text, message);
});

// Custom Auto-Rejoin
client.addListener('kick', (channel, nick, by, reason, message) => {
  arx7.kick(channel, nick, by, reason, message);
});

client.addListener('error', message => {
  arx7.error(message);
});

client.addListener('join', (channel, nick, message) => {
  arx7.join(channel, nick, message);

  // Praise the Creator
  if (nick === 'Desch' && channel == '#arx-7') {
    log(`Praising the creator \o/`);
    client.say(channel, 'Hello Master.');
  }
});
