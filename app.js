const fs = require('fs');
const debug = require('debug');
const log = debug('Boot');

if (process.env.NODE_ENV === 'production') {
  log('Booting Production Build');
  require('./lib/bot.js');
} else {
  log('Booting Development Build');
  log('Reading from `.env`');
  require('dotenv').config();
  require('./src/bot.js');
}
