const TelegramBot = require('node-telegram-bot-api');
const keys = require('./keys/keys');
const bot = new TelegramBot(keys.TOKEN, { polling: true });

const Schedule = require('./models/Schedule');
const Photo = require('./models/Photo');
const Keyboard = require('./models/Keyboard');
const InlineKeyboard = require('./models/InlineKeyboard');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Logger = require('./models/Logger');
const PDF = require('./models/PDF')

bot.on('message', (msg) => {
    let message = {};

    message.sender_id = msg.from.id;
    message.last_name = msg.from.last_name;
    message.first_name = msg.from.first_name;
    message.username = msg.from.username;
    message.date = msg.date;
    message.date_string = new Date(msg.date * 1000);
    message.text = msg.text;

    Logger.logMessage(message);
});

bot.on('inline_query', async query => {
    let teachers = await Teacher.getAllTeachers();
    teachers.sort((first, second) => {
        if (first.last_name < second.last_name) return -1;
        if (first.last_name < second.last_name) return 1;
    });

    let results = teachers.map(teacher => {
        return {
            type: 'article',
            id: teacher.id,
            title: `${teacher.last_name} ${teacher.first_name} ${teacher.patronymic}`,
            description: `Кафедра ${teacher.department_title}`,
            thumb_url: `http://www.skf-mtusi.ru/images/prep/${teacher.photo_on_website}.jpg`,
            input_message_content: {
                message_text: `<i>${teacher.last_name} ${teacher.first_name} ${teacher.patronymic}</i>\n<a href='http://www.skf-mtusi.ru/?page_id=${teacher.id_on_website}'>Профиль преподавателя на сайте СКФ МТУСИ</a>`,
                parse_mode: 'HTML',
            },
        }
    })

    bot.answerInlineQuery(query.id, results, {
        cache_time: 0
    })
})

bot.on('callback_query', async query => {
    const queryId = query.id;

    let callback_data;
    try {
        callback_data = JSON.parse(query.data);
    } catch (e) {
        throw new Error('Invalid callback data');
    }

    switch (callback_data.type) {
        case 'department':
            let teachersKeyboard = await InlineKeyboard.teachers(callback_data.id);
            bot.editMessageText('Выберите преподавателя:', {
                chat_id: query.message.chat.id,
                message_id: query.message.message_id,
                reply_markup: { inline_keyboard: teachersKeyboard }
            });
            bot.answerCallbackQuery(queryId);
            break;

        case 'teacher':
            const photoInfo = await Photo.getPhotoOfTeacherById(callback_data.id);
            await bot.sendPhoto(query.from.id, photoInfo.stream, photoInfo.options);
            await bot.deleteMessage(
                query.from.id,
                query.message.message_id
            );
            bot.answerCallbackQuery(queryId);
            break;

        case 'group':
            let userId = query.from.id;
            let groupId = callback_data.id;
            await User.changeGroup(userId, groupId);
            bot.answerCallbackQuery(queryId, { text: `Ваша группа изменена на ${callback_data.grp}` });
            break;

        case 'other_teacher':
            let otherTeachersKeyboard = await InlineKeyboard.teachers(callback_data.teachersDepartment);
            await bot.sendMessage(query.message.chat.id, 'Выберите преподавателя:', {
                reply_markup: { inline_keyboard: otherTeachersKeyboard }
            });
            await bot.deleteMessage(
                query.message.chat.id,
                query.message.message_id
            );
            bot.answerCallbackQuery(queryId);
            break;

        case 'other_department':
            let departmentsKeyboard = await InlineKeyboard.departments();

            bot.editMessageText('Выберите кафедру преподавателя:', {
                chat_id: query.message.chat.id,
                message_id: query.message.message_id,
                reply_markup: { inline_keyboard: departmentsKeyboard }
            });
            bot.answerCallbackQuery(queryId);
            break;

        case 'nav':
            let queryData = {};
            queryData.date = (Date.now() / 1000) + (callback_data.number - 1) * 86400;
            queryData.from = {};
            queryData.from.id = query.message.chat.id;

            bot.editMessageText(await Schedule.getTodaysLessons(queryData), {
                chat_id: query.message.chat.id,
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: InlineKeyboard.scheduleNavigation(Number(callback_data.number))
                }
            }).then(null, error => {
                console.error('Can\'t send the same message.')
            });
            bot.answerCallbackQuery(queryId);
            break;

        case 'pdf':
            let shedulePath = '';
            bot.sendChatAction(query.from.id, 'upload_document');
            switch (callback_data.doc) {
                case 'timetab':
                    shedulePath = await PDF.getTimetable(query.from.id);
                    break;
                case 'sched_day':
                    shedulePath = await PDF.getScheduleByDay(query.from.id);
                    break;
                case 'sched_week':
                    shedulePath = await PDF.getScheduleByWeek(query.from.id);
                    break;
                default:
                    shedulePath = '';
            }
            if (shedulePath.length > 0) {
                await bot.sendDocument(query.from.id, shedulePath);
                PDF.removeFile(shedulePath);
            }
            bot.answerCallbackQuery(queryId);
            break;

        default:
            bot.answerCallbackQuery(queryId, { text: 'Ошибка!' });
            break;
    }
});


bot.onText(/Пара сейчас/, async msg => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, await Schedule.getNow(msg), {
        reply_markup: {
            keyboard: Keyboard.commands()
        }
    });
});

bot.onText(/Пары сегодня/, async msg => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, await Schedule.getTodaysLessons(msg), {
        reply_markup: {
            keyboard: Keyboard.commands()
        }
    });
});

bot.onText(/Пары завтра/, async msg => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, await Schedule.getTomorrowsLessons(msg), {
        reply_markup: {
            keyboard: Keyboard.commands()
        }
    });
});

bot.onText(/Расписание звонков/, async msg => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, await Schedule.getTimetable(msg.from.id), {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: InlineKeyboard.timetable()
        }
    });
});

bot.onText(/Расписание занятий/, async msg => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, await Schedule.getTodaysLessons(msg), {
        reply_markup: {
            inline_keyboard: InlineKeyboard.scheduleNavigation(1)
        }
    });
});

bot.onText(/Выбрать свою группу/, msg => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Выберите свою группу:', {
        reply_markup: {
            inline_keyboard: InlineKeyboard.groups()
        }
    });
});

bot.onText(/Преподаватели/, async msg => {
    const chatId = msg.chat.id;

    let departmentsKeyboard = await InlineKeyboard.departments();

    bot.sendMessage(chatId, 'Выберите кафедру преподавателя:', {
        reply_markup: {
            inline_keyboard: departmentsKeyboard
        }
    });
});


bot.onText(/\/start/, async msg => {
    let chatId = msg.chat.id;

    let greetingContent = `Добро пожаловать`;
    const username = msg.from.username ? `, <b>${msg.from.username}</b>` : '';
    greetingContent += username + '!';

    await bot.sendMessage(chatId, greetingContent, {
        reply_markup: {
            keyboard: Keyboard.commands()
        },
        parse_mode: 'HTML'
    });

    let newUserInfo = {
        id: msg.chat.id,
        last_name: msg.chat.last_name,
        first_name: msg.chat.first_name,
        username: msg.chat.username,
        date: msg.date
    };

    await User.createNewUser(newUserInfo);

    await bot.sendMessage(chatId, 'Пожалуйста, выберите свою группу:', {
        reply_markup: {
            inline_keyboard: InlineKeyboard.groups(chatId)
        }
    });
});

bot.onText(/\/ping/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'pong', {
        reply_markup: {
            keyboard: Keyboard.commands()
        }
    });
});

bot.onText(/\/help/, async msg => {
    const chatId = msg.chat.id;
    let helpMessage = require('./data/info');

    await bot.sendMessage(chatId, helpMessage, {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: Keyboard.commands()
        }
    });

    await bot.sendChatAction(chatId, 'find_location');
    await bot.sendLocation(chatId, 47.219232, 39.712478);
});

bot.onText(/Справка/, async msg => {
    const chatId = msg.chat.id;
    let helpMessage = require('./data/info');

    await bot.sendMessage(chatId, helpMessage, {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: Keyboard.commands()
        }
    });

    await bot.sendChatAction(chatId, 'find_location');
    await bot.sendLocation(chatId, 47.219232, 39.712478);
});

bot.onText(/\/photo (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const lastname = match[1];
    const photoInfo = await Photo.getPhotoOfTeacherByLastname(lastname);
    photoInfo.forEach(teacher => {
        bot.sendPhoto(chatId, teacher.stream, teacher.options);
    });
});


// Error log
bot.on('polling_error', (error) => {
    console.log(error);
});
