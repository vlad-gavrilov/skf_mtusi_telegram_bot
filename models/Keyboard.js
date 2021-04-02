const mysql = require('mysql2/promise');
const DSN = require('../keys/database');

class Keyboard {
    static commands() {
        return [
            ['Пара сейчас', 'Пары сегодня'],
            ['Расписание звонков', 'Расписание занятий', 'Выбрать свою группу'],
            ['Преподаватели', 'Справка']
        ];
    }
};

module.exports = Keyboard;