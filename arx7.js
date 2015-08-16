let irc = require("irc");
let config = require('./config');

// Initialize the Bot
let client = new irc.Client(config.server, config.name, {
  channels: config.channels
});

// On Server Connect
client.addListener('registered', (message) => {
  // TODO: Identify. Below doesn't work (err_nosuchnick)
  // client.say('ns', `identify ${config.password}`);
});

// Praise the Creator
client.addListener('join', (channel, nick, message) => {
  if (nick === 'Desch') {
    client.say(channel, 'Hello Master.');
  }
});

// TODO: Make a callback register function or something. This is nasty already
// Listen for channel / personal Messages
client.addListener('message', (from, to, text, message) => {
  // Debug messages
  if (text.toLowerCase() === 'ping') {
    client.say(to, 'Pong');
  }

  if (text.toLowerCase() === 'bot respond') {
    client.say(to, 'I\'m a pretty stupid bot');
  }

  // Choose from List
  if (text.toLowerCase().startsWith('.c ') ||
      text.toLowerCase().startsWith('.choose ')) {
    client.say(to, 'Under development. Blame Jukey for making it hard');
    //https://github.com/Poorchop/hexchat-scripts/blob/master/Arnavion-scripts/choose.py
  }

  // Youtube
  if (text.toLowerCase().startsWith('.yt ')) {
    client.say(to, 'Under development');
  }
});

// Something happened. If we don't log it, the app will crash
client.addListener('error', message => console.log(`Error: ${message.command}`));
