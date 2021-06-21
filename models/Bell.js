const mysql = require('mysql2/promise');
const DSN = require('../keys/database');
const { logError } = require('./Logger');

class Bell {
  static async getBells(userId) {
    let bells = [];

    try {
      const connection = await mysql.createConnection(DSN);
      const [rows] = await connection.query('SELECT group_of_user FROM Users WHERE id=?', userId);
      connection.end();

      const groupId = rows[0].group_of_user;
      bells = require('../data/bells')[groupId];

      bells = bells.map((value) => [
        new Date(1970, 0, 1, value[0], value[1], 0, 0),
        new Date(1970, 0, 1, value[0], value[1] + 45, 0, 0),
        new Date(1970, 0, 1, value[0], value[1] + 50, 0, 0),
        new Date(1970, 0, 1, value[0], value[1] + 95, 0, 0),
      ]);
    } catch (error) {
      logError(error);
    }

    return bells;
  }
}

module.exports = Bell;
