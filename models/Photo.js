const Teacher = require('./Teacher');
const InlineKeboard = require('./InlineKeyboard');
const fs = require('fs');

class Photo {
    // Получить фото преподавателя по его ID
    // Возвращает объект, описывающий фото данного преподавателя
    static async getPhotoOfTeacherById(teacherId) {
        let teacherInfo = await Teacher.getTeacherInfoById(teacherId);
        let photoInfo = {};

        if (teacherInfo.id_on_website == undefined || teacherInfo.id_on_website == null) {
            photoInfo.stream = fs.createReadStream(`./photos/no_photo.jpg`);
        } else {
            photoInfo.stream = fs.createReadStream(`./photos/${teacherInfo.id_on_website}.jpg`);
        }

        photoInfo.options = {
            caption: `${teacherInfo.last_name}\n` + `${teacherInfo.first_name} ${teacherInfo.patronymic}\n`,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: InlineKeboard.otherTeachers(teacherInfo)
            }
        }

        return photoInfo;
    }

    // Получить фото преподавателя по его фамилии
    // Возвращает массив объектов, описывающих фото всех преподавателей с заданной фамилией (однофамильцев)
    static async getPhotoOfTeacherByLastname(lastname) {
        let teacherInfo = await Teacher.getTeacherInfoByLastname(lastname);

        let arrayOfPhotoInfos = teacherInfo.map(row => {
            let photoInfo = {};

            if (row.id_on_website == undefined || row.id_on_website == null) {
                photoInfo.stream = fs.createReadStream(`./photos/no_photo.jpg`);
            } else {
                photoInfo.stream = fs.createReadStream(`./photos/${row.id_on_website}.jpg`);
            }

            photoInfo.options = {
                caption: `${row.last_name}\n` + `${row.first_name} ${row.patronymic}\n`,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: InlineKeboard.otherTeachers(row)
                }
            }

            return(photoInfo);
        });

        return arrayOfPhotoInfos;
    }
}

module.exports = Photo;