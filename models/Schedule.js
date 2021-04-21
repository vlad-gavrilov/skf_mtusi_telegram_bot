const TimeHelper = require('../helpers/TimeHelper');
const ParseHelper = require('./../helpers/ParseHelper');
const Bell = require('./Bell');
const mysql = require('mysql2/promise');
const DSN = require('../keys/database');

class Schedule {
    static async getNow(msg) {
        let outputString = '';

        try {
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

            outputString = TimeHelper.getFormatedStringFromDate(currentDate);

            const currentMinutes = TimeHelper.minutesPassedSinceMidnight(currentDate);
            const currentDayOfWeek = currentDate.getDay();

            function formatLesson(lesson) {
                // Если объект lesson пустой
                if (Object.keys(lesson).length == 0) {
                    return 'В текущее время занятий нет';
                } else {
                    let lessonFormated = '\n';
                    lessonFormated += 'Пара ' + lesson.number + ': \n';
                    lessonFormated += lesson.type[0].toUpperCase() + lesson.type.substring(1) + '\n' + lesson.title + '\n';
                    lessonFormated += 'Преподаватель: ' + lesson.teacher + '\n'
                    lessonFormated += 'Кабинет: ' + lesson.cabinet + '\n';
                    return lessonFormated;
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
        } catch (error) {
            console.error(error);
        }
        return outputString;
    }

    static async getTodaysLessons(msg) {
        let outputString = '';

        try {
            let currentDate = new Date(msg.date * 1000);
            let keyOfCurrentDate = (new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0)).getTime();

            outputString = TimeHelper.getFormatedStringWithWeekdayFromDate(currentDate);

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

        } catch (error) {
            console.error(error);
        }

        return outputString;
    }

    static async getTomorrowsLessons(msg) {
        let outputString = '';

        try {
            let tomorrowDate = new Date(msg.date * 1000 + 86400000);
            let keyOfTomorrowDate = (new Date(tomorrowDate.getFullYear(), tomorrowDate.getMonth(), tomorrowDate.getDate(), 0, 0, 0, 0)).getTime();

            outputString = TimeHelper.getFormatedStringWithWeekdayFromDate(tomorrowDate);

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
        } catch (error) {
            console.error(error);
        }

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
        let sched = {};

        try {
            const connection = await mysql.createConnection(DSN);
            let [rows] = await connection.query('SELECT group_of_user FROM Users WHERE id=?', userId);
            const groupId = rows[0].group_of_user;
            connection.end();
            sched = ParseHelper.parseSchedule(groupId);
        } catch (error) {
            console.error(error);
        }

        return sched;
    }
}

module.exports = Schedule;