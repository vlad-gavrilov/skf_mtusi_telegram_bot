const cheerio = require('cheerio')

class ParseHelper {
    static parseSchedule(groupId) {
        const html = ParseHelper.getRawSchedule(groupId);
        const $ = cheerio.load(html);
        let parsedSchedule = {};

        $('table tr').each(function (i, elem) {
            let dateOfLesson;
            $('td', this).each(function (j, item) {
                switch (j) {
                    case 0:
                        dateOfLesson = $(this).text().split('-');
                        dateOfLesson = new Date((new Date()).getFullYear(), --dateOfLesson[1], dateOfLesson[0], 0, 0, 0, 0);
                        dateOfLesson = dateOfLesson.getTime();
                        if (parsedSchedule[dateOfLesson] === undefined) {
                            parsedSchedule[dateOfLesson] = [{}];
                        } else {
                            parsedSchedule[dateOfLesson].push({});
                        };
                        break;
                    case 1:
                        parsedSchedule[dateOfLesson][parsedSchedule[dateOfLesson].length - 1].weekday = $(this).text();
                        break;
                    case 2:
                        parsedSchedule[dateOfLesson][parsedSchedule[dateOfLesson].length - 1].number = $(this).text();
                        break;
                    case 3:
                        parsedSchedule[dateOfLesson][parsedSchedule[dateOfLesson].length - 1].title = $(this).text();
                        break;
                    case 4:
                        parsedSchedule[dateOfLesson][parsedSchedule[dateOfLesson].length - 1].type = $(this).text();
                        break;
                    case 5:
                        parsedSchedule[dateOfLesson][parsedSchedule[dateOfLesson].length - 1].teacher = $(this).text();
                        break;
                    case 6:
                        if ($(this).text() == '+') {
                            parsedSchedule[dateOfLesson].pop()
                        } else {
                            parsedSchedule[dateOfLesson][parsedSchedule[dateOfLesson].length - 1].cabinet = $(this).text();
                        }
                        break;
                    default:
                        break;
                }
            });
        });
        return parsedSchedule;
    }


    static parseScheduleLesson(groupId, dateOfLesson, numberOfLesson) {
        const sched = ParseHelper.parseSchedule(groupId);
        let keyOfdateOfLesson = (new Date(dateOfLesson.getFullYear(), dateOfLesson.getMonth(), dateOfLesson.getDate(), 0, 0, 0, 0)).getTime();

        let lesson = {};

        if (sched[keyOfdateOfLesson] == undefined) {
            return lesson;
        } else {
            sched[keyOfdateOfLesson].forEach(element => {
                if (element['number'] == numberOfLesson) {
                    lesson = element;
                }
            });
        }
        return lesson;
    }

    static getRawSchedule(groupId) {
        let path = '../data/schedule' + groupId;
        const html = require(path);
        return html;
    }
}

module.exports = ParseHelper;