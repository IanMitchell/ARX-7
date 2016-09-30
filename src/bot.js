import irc from 'irc';
import config from '../config';
import { ARX7 } from './arx7.js';

// Initialize the Bot
const client = new irc.Client(config.server, config.name, {
  userName: config.userName,
  port: config.port,
  secure: config.ssl,
  selfSigned: config.allowInvalidSSL,
  stripColors: true,
  floodProtection: true,
  floodProtectionDelay: config.floodProtectionDelay,
});

const arx7 = new ARX7(client, config);

// On Server Connect
client.addListener('registered', () => arx7.connect());

// Respond to Version requests
client.addListener('ctcp-version', (from, to) => arx7.version(from, to));

// Listen for channel / personal Messages
client.addListener('message', (from, to, text) => arx7.message(from, to, text));

// Custom Auto-Rejoin
client.addListener('kick', (channel, nick, by, reason) => arx7.kick(channel, nick, by, reason));

client.addListener('error', message => arx7.error(message));

client.addListener('join', (channel, nick) => arx7.join(channel, nick));
