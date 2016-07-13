const fs = require('fs');

// Account for CI environments
try {
  fs.statSync(`${__dirname}/test/.env`);
  require('dotenv').config({ path: `${__dirname}/test/.env` });
} catch (e) {
  // CI Build
}
