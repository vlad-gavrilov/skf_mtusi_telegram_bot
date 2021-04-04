const fs = require('fs');
const { jsPDF } = require('jspdf');
const { autoTable } = require('jspdf-autotable');
const TimeHelper = require('../helpers/TimeHelper');
const GroupHelper = require('../helpers/GroupHelper');
const User = require('./User');
const Bell = require('./Bell');
const Schedule = require('./Schedule');
const ParseHelper = require('../helpers/ParseHelper');

class PDF {
    static async getTimetable(userId) {
        let grp = await User.getGroupOfUser(userId);
        let grpLatin = GroupHelper.getGroupNameLatin(grp);
        let grpCyrillic = GroupHelper.getGroupNameCyrillic(grp);
        let filePath = `Timetable_${grpLatin}.pdf`;

        const doc = new jsPDF();

        const myFont = require('../data/font.js');
        doc.addFileToVFS("MyFont.ttf", myFont);
        doc.addFont("MyFont.ttf", "MyFont", "normal");
        doc.setFont("MyFont");

        let heightOfRow = 7;
        doc.text('СЕВЕРО-КАВКАЗСКИЙ ФИЛИАЛ', 20, 20);
        doc.text('МОСКОВСКОГО ТЕХНИЧЕСКОГО УНИВЕРСИТЕТА', 20, 20 + heightOfRow * 1);
        doc.text('СВЯЗИ И ИНФОРМАТИКИ', 20, 20 + heightOfRow * 2);
        doc.text('Расписание звонков', 20, 20 + heightOfRow * 4);
        doc.text(`Группа ${grpCyrillic}`, 20, 20 + heightOfRow * 5);

        let bells = await Bell.getBells(userId);
        let outputString = '';
        if (bells.length > 3) {
            outputString += 'Cуббота:\n';
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

        doc.cell(20, 20 + heightOfRow * 7, 40, 145, outputString, 12, 'center')

        doc.setFontSize(12);
        let generationDate = new Date(Date.now());
        outputString = `${generationDate.getDate()} ${TimeHelper.getMonthName(generationDate.getMonth())} ${generationDate.getFullYear()} года `;

        doc.text(`PDF-файл сгенерирован телеграм-ботом @mtusi_bot`, 20, 275);
        outputString = `${generationDate.getDate()} ${TimeHelper.getMonthName(generationDate.getMonth())} ${generationDate.getFullYear()} года`;
        doc.text(`Дата создания: ${outputString}`, 20, 280);
        outputString = `${TimeHelper.buildStringHoursAndMinutesAndSeconds(generationDate)} `;
        doc.text(`Время создания: ${outputString}`, 20, 285);

        doc.setDocumentProperties({
            author: '@mtusi_bot',
            keywords: 'Расписание, звонки, СКФ МТУСИ',
            subject: `Расписание звонков группы ${grpCyrillic}`,
            title: `PDF-файл сгенерирован телеграм-ботом @mtusi_bot`,
            creator: '@mtusi_bot',
        });

        doc.save(filePath);

        return filePath;
    }

    static async getScheduleByDay(userId) {
        let grp = await User.getGroupOfUser(userId);
        let grpLatin = GroupHelper.getGroupNameLatin(grp);
        let grpCyrillic = GroupHelper.getGroupNameCyrillic(grp);
        let filePath = `Schedule_${grpLatin}.pdf`;

        let schedule = await Schedule.getAllLessons(userId);

        const doc = new jsPDF();

        const myFont = require('../data/font.js');
        doc.addFileToVFS("MyFont.ttf", myFont);
        doc.addFont("MyFont.ttf", "MyFont", "normal");
        doc.setFont("MyFont");

        doc.setFontSize(16);

        let heightOfRow = 7;
        doc.text('СЕВЕРО-КАВКАЗСКИЙ ФИЛИАЛ', 20, 20);
        doc.text('МОСКОВСКОГО ТЕХНИЧЕСКОГО УНИВЕРСИТЕТА', 20, 20 + heightOfRow * 1);
        doc.text('СВЯЗИ И ИНФОРМАТИКИ', 20, 20 + heightOfRow * 2);
        doc.text(`Группа ${grpCyrillic}`, 20, 20 + heightOfRow * 4);
        doc.text('Расписание занятий', 20, 20 + heightOfRow * 6);

        let firstLessonDate = null, lastLessonDate = null;

        for (let key in schedule) {
            if (!isNaN(key)) {
                if (!firstLessonDate) firstLessonDate = key;
                lastLessonDate = key;

                doc.addPage();
                doc.setFontSize(16);

                heightOfRow = 7;
                doc.text('Расписание занятий', 14, 20);
                doc.text(`Группа ${grpCyrillic}`, 14, 20 + heightOfRow * 1);

                let date = new Date(+key);
                date = TimeHelper.getFormatedStringWithWeekdayFromDate(date);
                doc.text(date, 14, 20 + heightOfRow * 2);

                let body = [];
                schedule[key].forEach(lesson => {
                    body.push([lesson.number, lesson.title, lesson.type, lesson.teacher, lesson.cabinet])
                }
                );

                doc.autoTable({
                    startY: 50,
                    head: [['Пара', 'Дисциплина', 'Вид', 'Преподаватель', 'Аудитория']],
                    body: body,
                    styles: {
                        font: "MyFont"
                    },
                    headStyles: {
                        fillColor: "#0f73dd"
                    },
                    theme: 'grid'
                })

                doc.setFontSize(12);
                let generationDate = new Date(Date.now());
                let outputString = '';
                outputString = `${generationDate.getDate()} ${TimeHelper.getMonthName(generationDate.getMonth())} ${generationDate.getFullYear()} года `;

                doc.text(`PDF-файл сгенерирован телеграм-ботом @mtusi_bot`, 14, 275);
                outputString = `${generationDate.getDate()} ${TimeHelper.getMonthName(generationDate.getMonth())} ${generationDate.getFullYear()} года`;
                doc.text(`Дата создания: ${outputString}`, 14, 280);
                outputString = `${TimeHelper.buildStringHoursAndMinutesAndSeconds(generationDate)} `;
                doc.text(`Время создания: ${outputString}`, 14, 285);
            }
        }

        doc.setFontSize(16);
        doc.setPage(1);
        doc.text(`c ${TimeHelper.getFormatedDayAndMonthFromDate(new Date(+firstLessonDate))} по ${TimeHelper.getFormatedDayAndMonthFromDate(new Date(+lastLessonDate))}`, 20, 20 + heightOfRow * 7);

        doc.setDocumentProperties({
            author: '@mtusi_bot',
            keywords: 'Расписание, пары, СКФ МТУСИ',
            subject: `Расписание занятий группы ${grpCyrillic}`,
            title: `PDF-файл сгенерирован телеграм-ботом @mtusi_bot`,
            creator: '@mtusi_bot',
        });

        doc.save(filePath);

        return filePath;
    }

    static async getScheduleByWeek(userId) {
        let grp = await User.getGroupOfUser(userId);
        let grpLatin = GroupHelper.getGroupNameLatin(grp);
        let grpCyrillic = GroupHelper.getGroupNameCyrillic(grp);
        let filePath = `Schedule_${grpLatin}.pdf`;

        let schedule = await Schedule.getAllLessons(userId);

        const doc = new jsPDF();

        const myFont = require('../data/font.js');
        doc.addFileToVFS("MyFont.ttf", myFont);
        doc.addFont("MyFont.ttf", "MyFont", "normal");
        doc.setFont("MyFont");

        doc.setFontSize(16);

        let heightOfRow = 7;
        doc.text('СЕВЕРО-КАВКАЗСКИЙ ФИЛИАЛ', 20, 20);
        doc.text('МОСКОВСКОГО ТЕХНИЧЕСКОГО УНИВЕРСИТЕТА', 20, 20 + heightOfRow * 1);
        doc.text('СВЯЗИ И ИНФОРМАТИКИ', 20, 20 + heightOfRow * 2);
        doc.text(`Группа ${grpCyrillic}`, 20, 20 + heightOfRow * 4);
        doc.text('Расписание занятий', 20, 20 + heightOfRow * 6);

        let firstLessonDate = null, lastLessonDate = null;

        let body = [];
        let numberOfWeek = null;

        for (let key in schedule) {
            if (!isNaN(key)) {
                if (!firstLessonDate) firstLessonDate = key;
                lastLessonDate = key;

                let date = new Date(+key);
                numberOfWeek = TimeHelper.getNumberOfWeek(date);

                if (body.length > 0 && body[0][0] != numberOfWeek) {
                    doc.addPage();
                    doc.setFontSize(16);
                    heightOfRow = 7;
                    doc.text('Расписание занятий', 14, 20);
                    doc.text(`Группа ${grpCyrillic}`, 14, 20 + heightOfRow * 1);
                    doc.text(`Неделя №${numberOfWeek - 1}`, 14, 20 + heightOfRow * 2);

                    doc.autoTable({
                        startY: 50,
                        head: [['Дата', 'День', 'Пара', 'Дисциплина', 'Вид', 'Преподаватель', 'Ауд.']],
                        body: body.map(element => element.slice(1)),
                        styles: {
                            font: "MyFont"
                        },
                        headStyles: {
                            fillColor: "#0f73dd"
                        },
                        theme: 'grid'
                    })

                    doc.setFontSize(12);
                    let generationDate = new Date(Date.now());
                    let outputString = '';
                    outputString = `${generationDate.getDate()} ${TimeHelper.getMonthName(generationDate.getMonth())} ${generationDate.getFullYear()} года `;

                    doc.text(`PDF-файл сгенерирован телеграм-ботом @mtusi_bot`, 14, 275);
                    outputString = `${generationDate.getDate()} ${TimeHelper.getMonthName(generationDate.getMonth())} ${generationDate.getFullYear()} года`;
                    doc.text(`Дата создания: ${outputString}`, 14, 280);
                    outputString = `${TimeHelper.buildStringHoursAndMinutesAndSeconds(generationDate)} `;
                    doc.text(`Время создания: ${outputString}`, 14, 285);

                    body = [];
                }

                schedule[key].forEach(lesson => {
                    body.push(
                        [
                            numberOfWeek,
                            TimeHelper.getFormatedDayAndMonthFromDate(date),
                            TimeHelper.getWeekdayNameShort(date.getDay()),
                            lesson.number,
                            lesson.title,
                            lesson.type,
                            lesson.teacher,
                            lesson.cabinet
                        ]
                    )
                }
                );
            }
        }

        doc.addPage();
        doc.setFontSize(16);
        heightOfRow = 7;
        doc.text('Расписание занятий', 14, 20);
        doc.text(`Группа ${grpCyrillic}`, 14, 20 + heightOfRow * 1);
        doc.text(`Неделя №${numberOfWeek}`, 14, 20 + heightOfRow * 2);

        doc.autoTable({
            startY: 50,
            head: [['Дата', 'День', 'Пара', 'Дисциплина', 'Вид', 'Преподаватель', 'Ауд.']],
            body: body.map(element => element.slice(1)),
            styles: {
                font: "MyFont"
            },
            headStyles: {
                fillColor: "#0f73dd"
            },
            theme: 'grid'
        })

        doc.setFontSize(12);
        let generationDate = new Date(Date.now());
        let outputString = '';
        outputString = `${generationDate.getDate()} ${TimeHelper.getMonthName(generationDate.getMonth())} ${generationDate.getFullYear()} года `;

        doc.text(`PDF-файл сгенерирован телеграм-ботом @mtusi_bot`, 14, 275);
        outputString = `${generationDate.getDate()} ${TimeHelper.getMonthName(generationDate.getMonth())} ${generationDate.getFullYear()} года`;
        doc.text(`Дата создания: ${outputString}`, 14, 280);
        outputString = `${TimeHelper.buildStringHoursAndMinutesAndSeconds(generationDate)} `;
        doc.text(`Время создания: ${outputString}`, 14, 285);

        doc.setFontSize(16);
        doc.setPage(1);
        doc.text(`c ${TimeHelper.getFormatedDayAndMonthFromDate(new Date(+firstLessonDate))} по ${TimeHelper.getFormatedDayAndMonthFromDate(new Date(+lastLessonDate))}`, 20, 20 + heightOfRow * 7);

        doc.setDocumentProperties({
            author: '@mtusi_bot',
            keywords: 'Расписание, пары, СКФ МТУСИ',
            subject: `Расписание занятий группы ${grpCyrillic}`,
            title: `PDF-файл сгенерирован телеграм-ботом @mtusi_bot`,
            creator: '@mtusi_bot',
        });

        doc.save(filePath);

        return filePath;
    }

    static removeFile(path) {
        fs.rmSync(path);
    }
};

module.exports = PDF;