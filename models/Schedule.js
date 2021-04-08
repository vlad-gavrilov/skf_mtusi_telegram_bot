const TimeHelper = require('./../helpers/TimeHelper');
const ParseHelper = require('./../helpers/ParseHelper');
const { getGroupIDs } = require('./../helpers/GroupHelper');
const Bell = require('./Bell');
const Request = require('./Request');
const { writeFileSync, accessSync, constants } = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const DSN = require('../keys/database');

class Schedule {
    static async getNow(msg) {
        const connection = await mysql.createConnection(DSN);
        const [rows] = await connection.query('SELECT group_of_user FROM Users WHERE id=?', msg.from.id);
        connection.end();
        const groupId = rows[0].group_of_user;

        const userId = msg.from.id;
        const bells = await Bell.getBells(userId);
        const bellsMinutes = bells.map(array => {
            return array.map(date => {
                return TimeHelper.minutesPassedSinceMidnight(date);
            });
        });
        const currentDate = new Date(msg.date * 1000);
        // const currentDate = new Date(2020, 10, 20, 15, 30, 23, 432);

        let outputString = TimeHelper.getFormatedStringFromDate(currentDate);

        const currentMinutes = TimeHelper.minutesPassedSinceMidnight(currentDate);
        const currentDayOfWeek = currentDate.getDay();

        function formatLesson(lesson) {
            // Если объект lesson пустой
            if (Object.keys(lesson).length == 0) {
                return 'В текущее время занятий нет';
            } else {
                let outputString = '';
                outputString += '\n';
                outputString += 'Пара ' + lesson.number + ': \n';
                outputString += lesson.type[0].toUpperCase() + lesson.type.substring(1) + '\n' + lesson.title + '\n';
                outputString += 'Преподаватель: ' + lesson.teacher + '\n'
                outputString += 'Кабинет: ' + lesson.cabinet + '\n';
                return outputString;
            }
        }

        // Если текущий день воскресенье
        if (currentDayOfWeek == 0) {
            outputString += 'Сегодня воскресенье';
            // Если текущий день будний день
        } else {
            if (bells.length <= 3) {
                if (currentMinutes < bellsMinutes[0][0] || currentMinutes > bellsMinutes[2][3]) {
                    outputString += 'Сейчас занятий нет';
                } else if (currentMinutes > bellsMinutes[0][0] && currentMinutes < bellsMinutes[0][3]) {
                    // Сейчас идет первая пара
                    outputString += formatLesson(ParseHelper.parseScheduleLesson(groupId, currentDate, 1));
                } else if (currentMinutes > bellsMinutes[1][0] && currentMinutes < bellsMinutes[1][3]) {
                    // Сейчас идет вторая пара
                    outputString += formatLesson(ParseHelper.parseScheduleLesson(groupId, currentDate, 2));
                } else if (currentMinutes > bellsMinutes[2][0] && currentMinutes < bellsMinutes[2][3]) {
                    // Сейчас идет третья пара
                    outputString += formatLesson(ParseHelper.parseScheduleLesson(groupId, currentDate, 3));
                } else {
                    outputString += 'Сейчас перемена';
                }
            } else {
                // Если текущий день суббота
                if (currentDayOfWeek == 6) {
                    if (currentMinutes < bellsMinutes[0][0] || currentMinutes > bellsMinutes[2][3]) {
                        outputString += 'Сейчас занятий нет';
                    } else if (currentMinutes > bellsMinutes[0][0] && currentMinutes < bellsMinutes[0][3]) {
                        // Сейчас идет первая пара
                        outputString += formatLesson(ParseHelper.parseScheduleLesson(groupId, currentDate, 1));
                    } else if (currentMinutes > bellsMinutes[1][0] && currentMinutes < bellsMinutes[1][3]) {
                        // Сейчас идет вторая пара
                        outputString += formatLesson(ParseHelper.parseScheduleLesson(groupId, currentDate, 2));
                    } else if (currentMinutes > bellsMinutes[2][0] && currentMinutes < bellsMinutes[2][3]) {
                        // Сейчас идет третья пара
                        outputString += formatLesson(ParseHelper.parseScheduleLesson(groupId, currentDate, 3));
                    } else {
                        outputString += 'Сейчас перемена';
                    }
                    // Если текущий день НЕ суббота
                } else {
                    if (currentMinutes < bellsMinutes[3][0] || currentMinutes > bellsMinutes[5][3]) {
                        outputString += 'Сейчас занятий нет';
                    } else if (currentMinutes > bellsMinutes[3][0] && currentMinutes < bellsMinutes[3][3]) {
                        // Сейчас идет четвертая пара
                        outputString += formatLesson(ParseHelper.parseScheduleLesson(groupId, currentDate, 4));
                    } else if (currentMinutes > bellsMinutes[4][0] && currentMinutes < bellsMinutes[4][3]) {
                        // Сейчас идет пятая пара
                        outputString += formatLesson(ParseHelper.parseScheduleLesson(groupId, currentDate, 5));
                    } else if (currentMinutes > bellsMinutes[5][0] && currentMinutes < bellsMinutes[5][3]) {
                        // Сейчас идет шестая пара
                        outputString += formatLesson(ParseHelper.parseScheduleLesson(groupId, currentDate, 6));
                    } else {
                        outputString += 'Сейчас перемена';
                    }
                }
            }

        }
        return outputString;
    }

    static async getTodaysLessons(msg) {
        let currentDate = new Date(msg.date * 1000);
        // let currentDate = new Date(2020, 10, 17, 15, 34, 52);
        let keyOfCurrentDate = (new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0)).getTime();

        let outputString = TimeHelper.getFormatedStringWithWeekdayFromDate(currentDate);

        const connection = await mysql.createConnection(DSN);
        let [rows] = await connection.query('SELECT group_of_user FROM Users WHERE id=?', msg.from.id);
        const groupId = rows[0].group_of_user;
        [rows] = await connection.query('SELECT name FROM Groups WHERE group_id=?', groupId);
        const groupName = rows[0].name;
        connection.end();

        outputString += `Группа: ${groupName}\n`;

        let sched = ParseHelper.parseSchedule(groupId);

        if (sched[keyOfCurrentDate] !== undefined) {
            let todaysLessons = sched[keyOfCurrentDate];
            outputString += 'Количество занятий: ' + todaysLessons.length + '\n';
            todaysLessons.forEach(lesson => {
                outputString += '\n';
                outputString += 'Пара ' + lesson.number + ': \n';
                outputString += lesson.type[0].toUpperCase() + lesson.type.substring(1) + '\n' + lesson.title + '\n';
                outputString += 'Преподаватель: ' + lesson.teacher + '\n'
                outputString += 'Кабинет: ' + lesson.cabinet + '\n';
            });
        } else {
            outputString += 'В этот день пар нет';
        };

        return outputString;
    }

    static async getTomorrowsLessons(msg) {
        let tomorrowDate = new Date(msg.date * 1000 + 86400000);
        let keyOfTomorrowDate = (new Date(tomorrowDate.getFullYear(), tomorrowDate.getMonth(), tomorrowDate.getDate(), 0, 0, 0, 0)).getTime();

        let outputString = TimeHelper.getFormatedStringWithWeekdayFromDate(tomorrowDate);

        const connection = await mysql.createConnection(DSN);
        let [rows] = await connection.query('SELECT group_of_user FROM Users WHERE id=?', msg.from.id);
        const groupId = rows[0].group_of_user;
        [rows] = await connection.query('SELECT name FROM Groups WHERE group_id=?', groupId);
        const groupName = rows[0].name;
        connection.end();

        outputString += `Группа: ${groupName}\n`;

        let sched = ParseHelper.parseSchedule(groupId);

        if (sched[keyOfTomorrowDate] !== undefined) {
            let todaysLessons = sched[keyOfTomorrowDate];
            outputString += 'Количество занятий: ' + todaysLessons.length + '\n';
            todaysLessons.forEach(lesson => {
                outputString += '\n';
                outputString += 'Пара ' + lesson.number + ': \n';
                outputString += lesson.type[0].toUpperCase() + lesson.type.substring(1) + '\n' + lesson.title + '\n';
                outputString += 'Преподаватель: ' + lesson.teacher + '\n'
                outputString += 'Кабинет: ' + lesson.cabinet + '\n';
            });
        } else {
            outputString += 'В этот день пар нет';
        };

        return outputString;
    }

    static async getTimetable(userId) {
        let bells = await Bell.getBells(userId);

        let outputString = '<b><a href="http://www.skf-mtusi.ru/?page_id=477">Расписание звонков</a></b>\n';
        outputString += '<pre>';

        if (bells.length > 3) {
            outputString += '\nCуббота:\n';
        }
        for (let i = 0; i < 3; i++) {
            outputString += `   ${i + 1} пара\n`;
            outputString += `${TimeHelper.buildStringHoursAndMinutes(bells[i][0])} - ${TimeHelper.buildStringHoursAndMinutes(bells[i][1])}\n`;
            outputString += `${TimeHelper.buildStringHoursAndMinutes(bells[i][2])} - ${TimeHelper.buildStringHoursAndMinutes(bells[i][3])}\n`;
        };
        if (bells.length > 3) {
            outputString += '\nБудние дни:\n';
            for (let i = 3; i < 6; i++) {
                outputString += `   ${i + 1} пара\n`;
                outputString += `${TimeHelper.buildStringHoursAndMinutes(bells[i][0])} - ${TimeHelper.buildStringHoursAndMinutes(bells[i][1])}\n`;
                outputString += `${TimeHelper.buildStringHoursAndMinutes(bells[i][2])} - ${TimeHelper.buildStringHoursAndMinutes(bells[i][3])}\n`;
            };
        }
        outputString += '</pre>';

        return outputString;
    }

    static async getAllLessons(userId) {
        const connection = await mysql.createConnection(DSN);
        let [rows] = await connection.query('SELECT group_of_user FROM Users WHERE id=?', userId);
        const groupId = rows[0].group_of_user;
        connection.end();

        let sched = ParseHelper.parseSchedule(groupId);

        return sched;
    }

    static async updateSchedule(bot) {
        let groups = await getGroupIDs();
        groups.forEach(async group => {
            let groupId = group.group_id;

            let filePath = path.join(__dirname, `../data/schedule${groupId}.js`);

            try {
                accessSync(filePath, constants.R_OK | constants.W_OK);
                let newSchedule = await Request.getScheduleFromSite(groupId);
                if (newSchedule.length > 1000) {
                    let oldSchedule = require(`../data/schedule${groupId}.js`);
                    if (newSchedule != oldSchedule) {
                        writeFileSync(filePath, Schedule.wrapRawSchedule(newSchedule));
                        //TODO send a change notification
                    }
                }
            } catch (error) {
                console.log(error);
                writeFileSync(filePath, Schedule.wrapRawSchedule(''));
            }
        });
    }

    static wrapRawSchedule(rawSchedule) {
        return `module.exports = "${rawSchedule}";`;
    }
}

module.exports = Schedule;