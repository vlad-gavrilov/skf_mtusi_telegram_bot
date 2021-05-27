const mysql = require('mysql2/promise');
const DSN = require('../keys/database');
const { logError } = require('../models/Logger');

class User {
    static async createNewUser(newUserInfo) {
        try {
            const connection = await mysql.createConnection(DSN);

            const [countOfUsers] = await connection.query('SELECT * FROM Users WHERE id=?', newUserInfo.id);

            if (countOfUsers.length == 0) {
                let sqlQuery = `INSERT INTO Users VALUES (${newUserInfo.id}, `;
                sqlQuery += newUserInfo.last_name ? `'${newUserInfo.last_name}', ` : 'null, ';
                sqlQuery += newUserInfo.first_name ? `'${newUserInfo.first_name}', ` : 'null, ';
                sqlQuery += `'${newUserInfo.username}', `;
                sqlQuery += `${newUserInfo.date}, 0)`;

                await connection.query(sqlQuery);
            }
            connection.end();
        } catch (error) {
            logError(error);
        }
    }

    static async changeGroup(userId, groupId) {
        try {
            const connection = await mysql.createConnection(DSN);
            await connection.query('UPDATE Users SET group_of_user = ? WHERE id = ?', [groupId, userId]);
            connection.end();
        } catch (error) {
            logError(error);
        }
    }

    static async getGroupOfUser(userId) {
        let group = 0;

        try {
            const connection = await mysql.createConnection(DSN);
            const [rows] = await connection.query('SELECT group_of_user FROM Users WHERE id=?', userId);
            connection.end();
            group = rows[0].group_of_user
        } catch (error) {
            logError(error);
        }

        return group;
    }
};

module.exports = User;