const Keyboard = require('../models/Keyboard');

describe('Метод commands', () => {
  test('должен вернуть массив с командами', () => {
    const keyboard = Keyboard.commands();

    expect(keyboard).toEqual([
      ['Пара сейчас', 'Пары сегодня', 'Пары завтра'],
      ['Расписание звонков', 'Расписание занятий'],
      ['Выбрать свою группу', 'Справка'],
      ['Преподаватели'],
    ]);
  });
});
