const mysql = require('mysql2/promise');
const DSN = require('../keys/database');
const sanitizeHtml = require('sanitize-html');

class Logger {
    static prepareMessage(rawMessage, type = "message") {
        let message = {};
        try {
            message.sender_id = rawMessage.from.id;
            message.type = type;

            message.last_name = rawMessage.from.last_name ?? "NULL";
            message.last_name = sanitizeHtml(message.last_name);
            message.last_name = message.last_name.replaceAll("\'", "\\'");
           
            message.first_name = rawMessage.from.first_name ?? "NULL";
            message.first_name = sanitizeHtml(message.first_name);
            message.first_name = message.first_name.replaceAll("\'", "\\'");

            message.username = rawMessage.from.username ?? "NULL";

            if (type == "message") {
                message.date = rawMessage.date;
                message.text = rawMessage.text;
            } else if (type == "callback") {
                message.date = rawMessage.message.edit_date ? rawMessage.message.edit_date : rawMessage.message.date;
                message.text = rawMessage.data;
            }
        } catch (error) {
            console.error(error);
        }
        return message;
    }

    static async logMessage(message) {
        try {
            const connection = await mysql.createConnection(DSN);
            let sqlQuery = 'INSERT INTO LoggedMessages VALUES ';
            sqlQuery += `(NULL, ${message.sender_id}, '${message.type}', '${message.last_name}', `;
            sqlQuery += `'${message.first_name}', '${message.username}', ${message.date}, `;
            sqlQuery += `'${message.text}')`;
            await connection.query(sqlQuery);
            connection.end();
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Logger;