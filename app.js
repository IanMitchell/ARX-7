const fs = require('fs');
const debug = require('debug');
const log = debug('Boot');

require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  log('Booting Production Build');
  require('./lib/bot.js');
} else {
  log('Booting Development Build');
  log('Reading from `.env`');
  require('./src/bot.js');
}
