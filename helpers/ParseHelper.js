const cheerio = require('cheerio');
const fs = require('fs/promises');
const path = require('path');
const { logError } = require('../models/Logger');

class ParseHelper {
  static async parseSchedule(groupId) {
    const html = await ParseHelper.getRawSchedule(groupId);
    const $ = cheerio.load(html);
    const parsedSchedule = {};

    $('table tr').each(function (i, elem) {
      let dateOfLesson;
      $('td', this).each(function (j, item) {
        switch (j) {
          case 0:
            dateOfLesson = $(this).text().split('-');
            dateOfLesson = new Date(
              (new Date()).getFullYear(), dateOfLesson[1] - 1, dateOfLesson[0], 0, 0, 0, 0,
            );
            dateOfLesson = dateOfLesson.getTime();
            if (parsedSchedule[dateOfLesson] === undefined) {
              parsedSchedule[dateOfLesson] = [{}];
            } else {
              parsedSchedule[dateOfLesson].push({});
            }
            break;
          case 1:
            parsedSchedule[dateOfLesson][parsedSchedule[dateOfLesson].length - 1]
              .weekday = $(this).text();
            break;
          case 2:
            parsedSchedule[dateOfLesson][parsedSchedule[dateOfLesson].length - 1]
              .number = $(this).text();
            break;
          case 3:
            parsedSchedule[dateOfLesson][parsedSchedule[dateOfLesson].length - 1]
              .title = $(this).text();
            break;
          case 4:
            parsedSchedule[dateOfLesson][parsedSchedule[dateOfLesson].length - 1]
              .type = $(this).text();
            break;
          case 5:
            parsedSchedule[dateOfLesson][parsedSchedule[dateOfLesson].length - 1]
              .teacher = $(this).text();
            break;
          case 6:
            if ($(this).text() === '+') {
              parsedSchedule[dateOfLesson].pop();
            } else {
              parsedSchedule[dateOfLesson][parsedSchedule[dateOfLesson].length - 1]
                .cabinet = $(this).text();
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
    const keyOfdateOfLesson = (new Date(
      dateOfLesson.getFullYear(), dateOfLesson.getMonth(), dateOfLesson.getDate(), 0, 0, 0, 0,
    )).getTime();

    let lesson = {};

    if (sched[keyOfdateOfLesson] === undefined) {
      return lesson;
    }
    sched[keyOfdateOfLesson].forEach((element) => {
      if (element.number === numberOfLesson) {
        lesson = element;
      }
    });

    return lesson;
  }

  static async getRawSchedule(groupId) {
    let html = '';
    try {
      const filePath = path.join(__dirname, `../data/schedule${groupId}.txt`);
      html = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      logError(error);
    }
    return html;
  }
}

module.exports = ParseHelper;
