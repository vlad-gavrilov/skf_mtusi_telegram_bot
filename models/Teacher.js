const mysql = require('mysql2/promise');
const DSN = require('../keys/database');
const { logError } = require('./Logger');

class Teacher {
  static async getTeacherInfoById(teacherId) {
    let info = {};
    try {
      const connection = await mysql.createConnection(DSN);
      const [rows] = await connection.query('SELECT * FROM Teachers WHERE id=?', teacherId);
      connection.end();
      [info] = rows;
    } catch (error) {
      logError(error);
    }
    return info;
  }

  static async getTeacherInfoByLastname(lastname) {
    let info = {};
    try {
      const connection = await mysql.createConnection(DSN);
      const [rows] = await connection.query('SELECT * FROM Teachers WHERE last_name=?', lastname);
      connection.end();
      info = rows;
    } catch (error) {
      logError(error);
    }
    return info;
  }

  static async getAllTeachers() {
    let teachers = {};
    try {
      const connection = await mysql.createConnection(DSN);
      const [rows] = await connection.query('SELECT * FROM Teachers INNER JOIN Departments ON Teachers.department=Departments.department_id');
      connection.end();
      teachers = rows;
    } catch (error) {
      logError(error);
    }
    return teachers;
  }
}

module.exports = Teacher;
