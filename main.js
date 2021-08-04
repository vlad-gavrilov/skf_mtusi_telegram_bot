const result = require('dotenv').config();
const { logError } = require('./models/Logger');

if (result.error) {
  logError(result.error);
} else {
  try {
    // eslint-disable-next-line global-require
    require('./controller');
  } catch (error) {
    logError(error);
  }
}
