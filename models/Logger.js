const path = require('path');
const fs = require('fs/promises');
const environment = require('../keys/environment');

class Logger {
  static async logError(error) {
    if (environment.NODE_ENV === 'development') {
      console.error(error);
    } else {
      const filePath = path.join(__dirname, '../errors.txt');
      try {
        const errorMessage = error.message ?? JSON.stringify(error);
        const errorData = `${new Date(Date.now())}\n${errorMessage}\n\n`;
        await fs.appendFile(filePath, errorData);
      } catch {
        console.error('Can\'t write error message to the log file');
      }
    }
  }
}

module.exports = Logger;
