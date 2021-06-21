const result = require('dotenv').config();
const { logError } = require('./models/Logger');

if (result.error) {
  logError(result.error);
} else {
  try {
    require('./controller');
  } catch (error) {
    logError(error);
  }
}
