const path = require('path');
const fs = require('fs');
const Teacher = require('./Teacher');
const InlineKeboard = require('./InlineKeyboard');

class Photo {
  // Получить фото преподавателя по его ID
  // Возвращает объект, описывающий фото данного преподавателя
  static async getPhotoOfTeacherById(teacherId) {
    const teacherInfo = await Teacher.getTeacherInfoById(teacherId);
    const photoInfo = {};

    let filePath = '';

    if (teacherInfo.id_on_website) {
      filePath = path.join(__dirname, `../photos/${teacherInfo.id_on_website}.jpg`);
      try {
        fs.accessSync(filePath, fs.constants.R_OK);
        photoInfo.stream = fs.createReadStream(filePath);
      } catch {
        filePath = path.join(__dirname, '../photos/no_photo.jpg');
        photoInfo.stream = fs.createReadStream(filePath);
      }
    } else {
      filePath = path.join(__dirname, '../photos/no_photo.jpg');
      photoInfo.stream = fs.createReadStream(filePath);
    }

    photoInfo.options = {
      caption: `${teacherInfo.last_name}\n${teacherInfo.first_name} ${teacherInfo.patronymic}\n`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: InlineKeboard.otherTeachers(teacherInfo),
      },
    };

    return photoInfo;
  }

  // Получить фото преподавателя по его фамилии
  // Возвращает массив объектов, описывающих
  // фото всех преподавателей с заданной фамилией (однофамильцев)
  static async getPhotoOfTeacherByLastname(lastname) {
    const teacherInfo = await Teacher.getTeacherInfoByLastname(lastname);

    const arrayOfPhotoInfos = teacherInfo.map((row) => {
      const photoInfo = {};

      let filePath = '';

      if (row.id_on_website) {
        filePath = path.join(__dirname, `../photos/${row.id_on_website}.jpg`);
        try {
          fs.accessSync(filePath, fs.constants.R_OK);
          photoInfo.stream = fs.createReadStream(filePath);
        } catch {
          filePath = path.join(__dirname, '../photos/no_photo.jpg');
          photoInfo.stream = fs.createReadStream(filePath);
        }
      } else {
        filePath = path.join(__dirname, '../photos/no_photo.jpg');
        photoInfo.stream = fs.createReadStream(filePath);
      }

      photoInfo.options = {
        caption: `${row.last_name}\n${row.first_name} ${row.patronymic}\n`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: InlineKeboard.otherTeachers(row),
        },
      };

      return (photoInfo);
    });

    return arrayOfPhotoInfos;
  }
}

module.exports = Photo;
