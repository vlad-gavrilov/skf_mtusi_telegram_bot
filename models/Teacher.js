const mysql = require('mysql2/promise');
const DSN = require('../keys/database');

class Teacher {
    static async getTeacherInfoById(teacherId) {
        const connection = await mysql.createConnection(DSN);
        const [rows, fields] = await connection.query('SELECT * FROM Teachers WHERE id=?', teacherId);
        connection.end();

        return rows[0];
    }

    static async getTeacherInfoByLastname(lastname) {
        const connection = await mysql.createConnection(DSN);
        const [rows, fields] = await connection.query('SELECT * FROM Teachers WHERE last_name=?', lastname);
        connection.end();
        
        return rows;
    }

    static async getAllTeachers() {
        const connection = await mysql.createConnection(DSN);
        const [rows] = await connection.query('SELECT * FROM Teachers INNER JOIN Departments ON Teachers.department=Departments.department_id');
        connection.end();
        return rows;
    }
};

module.exports = Teacher;