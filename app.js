const fs = require('fs');
const debug = require('debug');
const log = debug('Boot');

// Initialize Babel
require('babel-polyfill');
require('babel-core/register');

// Hacky check for dev/production startup
fs.stat('.env', (err, stat) => {
  if (stat) {
    log('Development environment, reading from `.env`');
    require('dotenv').config();
  } else {
    log('Production environment, reading from environmental variables');
  }

  // Start the bot
  require('./src/bot.js');
});
