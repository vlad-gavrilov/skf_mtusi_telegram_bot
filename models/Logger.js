const mysql = require('mysql2/promise');
const DSN = require('../keys/database');

class Logger {
    static async logMessage(message) {
        try {
            const connection = await mysql.createConnection(DSN);
            let sqlQuery = 'INSERT INTO LoggedMessages VALUES ';
            sqlQuery += `(NULL, ${message.sender_id}, '${message.last_name}', `;
            sqlQuery += `'${message.first_name}', '${message.username}', ${message.date}, `;
            sqlQuery += `'${message.date_string}', '${message.text}')`;
            await connection.query(sqlQuery);
            connection.end();
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Logger;