require('dotenv').config();
const InlineKeyboard = require('../models/InlineKeyboard');

describe('Метод departments', () => {
  test('должен вернуть массив с кафедрами', async () => {
    const received = await InlineKeyboard.departments();
    const expected = [
      [
        {
          text: 'Инфокоммуникационных технологий и систем связи',
          callback_data: '{"type":"department", "id":"1"}',
        },
      ],
      [
        {
          text: 'Информатики и вычислительной техники',
          callback_data: '{"type":"department", "id":"2"}',
        },
      ],
      [
        {
          text: 'Общенаучной подготовки',
          callback_data: '{"type":"department", "id":"3"}',
        },
      ],
      [
        {
          text: 'Научно-исследовательской работы и инновационного развития',
          callback_data: '{"type":"department", "id":"4"}',
        },
      ],
    ];

    expect(received).toEqual(expected);
  });

  test.each([1, 2, 3, 4])('должен вернуть массив с преподавателями кафедры id%i', async (departmentId) => {
    const received = await InlineKeyboard.teachers(departmentId);
    expect(received.length).toBeGreaterThan(1);
    expect(received).toContainEqual([
      {
        text: '« Выбрать другую кафедру',
        callback_data: '{"type":"other_department"}',
      },
    ]);
  });

  test.each([-1, 0, 5, 1000, 12.345, -0.00001, 'some string'])('должен вернуть массив с кнопкой выбора другой кафедры (%s)', async (departmentId) => {
    const received = await InlineKeyboard.teachers(departmentId);
    const expected = [
      [
        {
          text: '« Выбрать другую кафедру',
          callback_data: '{"type":"other_department"}',
        },
      ],
    ];
    expect(received).toHaveLength(1);
    expect(received).toEqual(expected);
  });
});
