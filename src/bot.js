import debug from 'debug';
import irc from 'irc';
import config from '../config';
import {ARX7} from './arx7.js';

let log = debug('Bot');

// Initialize the Bot
let client = new irc.Client(config.server, config.name, {
  userName: config.userName,
  port: config.port,
  secure: config.ssl,
  selfSigned: config.allowInvalidSSL,
  stripColors: true,
  floodProtection: true,
  floodProtectionDelay: config.floodProtectionDelay
});

let arx7 = new ARX7(client, config);

// On Server Connect
client.addListener('registered', (message) => {
  arx7.connect();
});

// Respond to Version requests
client.addListener('ctcp-version', (from, to, message) => {
  arx7.version(from, to);
});

// Listen for channel / personal Messages
client.addListener('message', (from, to, text, message) => {
  arx7.message(from, to, text);
});

// Custom Auto-Rejoin
client.addListener('kick', (channel, nick, by, reason, message) => {
  arx7.kick(channel, nick, by, reason);
});

client.addListener('error', message => {
  arx7.error(message);
});

client.addListener('join', (channel, nick, message) => {
  arx7.join(channel, nick);

  // Praise the Creator
  if (nick === 'Desch' && channel == '#arx-7') {
    log(`Praising the creator \o/`);
    client.say(channel, 'Hello Master.');
  }
});
