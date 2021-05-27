const mysql = require('mysql2/promise');
const DSN = require('../keys/database');
const { logError } = require('../models/Logger');

class InlineKeyboard {
    static async departments() {
        let departments = [];

        try {
            const connection = await mysql.createConnection(DSN);
            const [rows, fields] = await connection.execute('SELECT * FROM Departments');
            connection.end();

            rows.forEach(row => {
                let departmentCapitalized = row.department_title.charAt(0).toUpperCase() + row.department_title.slice(1);
                departments.push(
                    [
                        {
                            text: `${departmentCapitalized}`,
                            callback_data: `{"type":"department", "id":"${row.department_id}"}`
                        }
                    ]
                );
            });
        } catch (error) {
            logError(error);
        }

        return departments;
    }

    static async teachers(departmentId) {
        let teachers = [];

        try {
            const connection = await mysql.createConnection(DSN);
            const [rows, fields] = await connection.query('SELECT id, last_name, first_name, patronymic FROM Teachers WHERE department=?', departmentId);
            connection.end();

            rows.forEach(row => {
                teachers.push(
                    [
                        {
                            text: `${row.last_name} ${row.first_name} ${row.patronymic}`,
                            callback_data: `{"type":"teacher", "id":"${row.id}"}`
                        }
                    ]
                );
            });

            teachers.push(
                [
                    {
                        text: '« Выбрать другую кафедру',
                        callback_data: '{"type":"other_department"}'
                    }
                ]
            );
        } catch (error) {
            logError(error);
        }

        return teachers;
    }

    static groups() {
        const keyboard = [
            [
                { text: 'ДВ-11', callback_data: `{"type":"group", "id":"0", "grp":"ДВ-11"}` },
                { text: 'ДВ-21', callback_data: `{"type":"group", "id":"1", "grp":"ДВ-21"}` },
            ],
            [
                { text: 'ДИ-11', callback_data: `{"type":"group", "id":"2", "grp":"ДИ-11"}` },
                { text: 'ДИ-12', callback_data: `{"type":"group", "id":"3", "grp":"ДИ-12"}` },
                { text: 'ДИ-21', callback_data: `{"type":"group", "id":"4", "grp":"ДИ-21"}` },
                { text: 'ДИ-22', callback_data: `{"type":"group", "id":"5", "grp":"ДИ-22"}` },
            ],
            [
                { text: 'ДП-31', callback_data: `{"type":"group", "id":"6", "grp":"ДП-31"}` },
                { text: 'ДП-41', callback_data: `{"type":"group", "id":"7", "grp":"ДП-41"}` },
            ],
            [
                { text: 'ДЗ-31', callback_data: `{"type":"group", "id":"8", "grp":"ДЗ-31"}` },
                { text: 'ДС-31', callback_data: `{"type":"group", "id":"9", "grp":"ДС-31"}` },
                { text: 'ДЗ-41', callback_data: `{"type":"group", "id":"10", "grp":"ДЗ-41"}` },
            ]
        ];

        return keyboard;
    }

    static otherTeachers(teacherInfo) {
        return [
            [{ text: 'Ссылка на профиль', url: `http://www.skf-mtusi.ru/?page_id=${teacherInfo.id_on_website}` }],
            [{ text: '« Выбрать другого преподавателя', callback_data: `{"type":"other_teacher", "teachersDepartment":${teacherInfo.department}}` }]
        ]
    }

    static timetable() {
        return [
            [{ text: 'Звонки в формате PDF', callback_data: '{"type":"pdf", "doc":"timetab"}' }],
        ]
    }

    static scheduleNavigation(pageNumber) {
        let keyboard;
        const countOfSlides = 45;

        switch (pageNumber) {
            case 1:
                keyboard = [
                    [
                        { text: '· 1 ·', callback_data: `{"type":"nav", "number":"1"}` },
                        { text: '2', callback_data: `{"type":"nav", "number":"2"}` },
                        { text: '3', callback_data: `{"type":"nav", "number":"3"}` },
                        { text: '4 ›', callback_data: `{"type":"nav", "number":"4"}` },
                        { text: `${countOfSlides} »`, callback_data: `{"type":"nav", "number":"${countOfSlides}"}` },
                    ]
                ]
                break;
            case 2:
                keyboard = [
                    [
                        { text: '1', callback_data: `{"type":"nav", "number":"1"}` },
                        { text: '· 2 ·', callback_data: `{"type":"nav", "number":"2"}` },
                        { text: '3', callback_data: `{"type":"nav", "number":"3"}` },
                        { text: '4 ›', callback_data: `{"type":"nav", "number":"4"}` },
                        { text: `${countOfSlides} »`, callback_data: `{"type":"nav", "number":"${countOfSlides}"}` },
                    ]
                ]
                break;
            case 3:
                keyboard = [
                    [
                        { text: '1', callback_data: `{"type":"nav", "number":"1"}` },
                        { text: '2', callback_data: `{"type":"nav", "number":"2"}` },
                        { text: '· 3 ·', callback_data: `{"type":"nav", "number":"3"}` },
                        { text: '4 ›', callback_data: `{"type":"nav", "number":"4"}` },
                        { text: `${countOfSlides} »`, callback_data: `{"type":"nav", "number":"${countOfSlides}"}` },
                    ]
                ]
                break;
            case countOfSlides - 2:
                keyboard = [
                    [
                        { text: '« 1', callback_data: `{"type":"nav", "number":"1"}` },
                        { text: `‹ ${countOfSlides - 3}`, callback_data: `{"type":"nav", "number":"${countOfSlides - 3}"}` },
                        { text: `· ${countOfSlides - 2} ·`, callback_data: `{"type":"nav", "number":"${countOfSlides - 2}"}` },
                        { text: `${countOfSlides - 1}`, callback_data: `{"type":"nav", "number":"${countOfSlides - 1}"}` },
                        { text: `${countOfSlides}`, callback_data: `{"type":"nav", "number":"${countOfSlides}"}` },
                    ]
                ]
                break;
            case countOfSlides - 1:
                keyboard = [
                    [
                        { text: '« 1', callback_data: `{"type":"nav", "number":"1"}` },
                        { text: `‹ ${countOfSlides - 3}`, callback_data: `{"type":"nav", "number":"${countOfSlides - 3}"}` },
                        { text: `${countOfSlides - 2}`, callback_data: `{"type":"nav", "number":"${countOfSlides - 2}"}` },
                        { text: `· ${countOfSlides - 1} ·`, callback_data: `{"type":"nav", "number":"${countOfSlides - 1}"}` },
                        { text: `${countOfSlides}`, callback_data: `{"type":"nav", "number":"${countOfSlides}"}` },
                    ]
                ]
                break;
            case countOfSlides:
                keyboard = [
                    [
                        { text: '« 1', callback_data: `{"type":"nav", "number":"1"}` },
                        { text: `‹ ${countOfSlides - 3}`, callback_data: `{"type":"nav", "number":"${countOfSlides - 3}"}` },
                        { text: `${countOfSlides - 2}`, callback_data: `{"type":"nav", "number":"${countOfSlides - 2}"}` },
                        { text: `${countOfSlides - 1}`, callback_data: `{"type":"nav", "number":"${countOfSlides - 1}"}` },
                        { text: `· ${countOfSlides} ·`, callback_data: `{"type":"nav", "number":"${countOfSlides}"}` },
                    ]
                ]
                break;
            default:
                keyboard = [
                    [
                        { text: `« 1`, callback_data: `{"type":"nav", "number":"1"}` },
                        { text: `‹ ${pageNumber - 1}`, callback_data: `{"type":"nav", "number":"${pageNumber - 1}"}` },
                        { text: `· ${pageNumber} ·`, callback_data: `{"type":"nav", "number":"${pageNumber}"}` },
                        { text: `${pageNumber + 1} ›`, callback_data: `{"type":"nav", "number":"${pageNumber + 1}"}` },
                        { text: `${countOfSlides} »`, callback_data: `{"type":"nav", "number":"${countOfSlides}"}` },
                    ]
                ]
                break;
        }

        keyboard.push([{ text: 'PDF-файл с расписанием по дням', callback_data: '{"type":"pdf", "doc":"sched_day"}' }]);
        keyboard.push([{ text: 'PDF-файл с расписанием по неделям', callback_data: '{"type":"pdf", "doc":"sched_week"}' }]);

        return keyboard;
    }
}

module.exports = InlineKeyboard;