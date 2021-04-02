const fs = require('fs');
const { jsPDF } = require('jspdf');
const TimeHelper = require('../helpers/TimeHelper');
const GroupHelper = require('../helpers/GroupHelper');
const User = require('./User');
const Bell = require('./Bell');

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

    static removeFile(path) {
        fs.rmSync(path);
    }
};

module.exports = PDF;