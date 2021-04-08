const mysql = require('mysql2/promise');
const DSN = require('../keys/database');

class Keyboard {
    static commands() {
        return [
            ['Пара сейчас', 'Пары сегодня', 'Пары завтра'],
            ['Расписание звонков', 'Расписание занятий'],
            ['Выбрать свою группу', 'Справка'],
            ['Преподаватели'],
        ];
    }
};

module.exports = Keyboard;