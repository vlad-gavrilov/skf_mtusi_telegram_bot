require('dotenv').config();
const Bell = require('../models/Bell');

describe('Метод getBells', () => {
  test('должен вернуть массив звонков', async () => {
    const userId = 12345;

    const expected = [
      [
        new Date('1970-01-01T06:15:00.000Z'),
        new Date('1970-01-01T07:00:00.000Z'),
        new Date('1970-01-01T07:05:00.000Z'),
        new Date('1970-01-01T07:50:00.000Z'),
      ],
      [
        new Date('1970-01-01T08:05:00.000Z'),
        new Date('1970-01-01T08:50:00.000Z'),
        new Date('1970-01-01T08:55:00.000Z'),
        new Date('1970-01-01T09:40:00.000Z'),
      ],
      [
        new Date('1970-01-01T09:55:00.000Z'),
        new Date('1970-01-01T10:40:00.000Z'),
        new Date('1970-01-01T10:45:00.000Z'),
        new Date('1970-01-01T11:30:00.000Z'),
      ],
      [
        new Date('1970-01-01T11:15:00.000Z'),
        new Date('1970-01-01T12:00:00.000Z'),
        new Date('1970-01-01T12:05:00.000Z'),
        new Date('1970-01-01T12:50:00.000Z'),
      ],
      [
        new Date('1970-01-01T13:05:00.000Z'),
        new Date('1970-01-01T13:50:00.000Z'),
        new Date('1970-01-01T13:55:00.000Z'),
        new Date('1970-01-01T14:40:00.000Z'),
      ],
      [
        new Date('1970-01-01T14:55:00.000Z'),
        new Date('1970-01-01T15:40:00.000Z'),
        new Date('1970-01-01T15:45:00.000Z'),
        new Date('1970-01-01T16:30:00.000Z'),
      ],
    ];
    const received = await Bell.getBells(userId);

    expect(received).toEqual(expected);
  });

  test('должен залоггировать ошибку', async () => {
    const expected = [];
    let received;

    let userId;
    received = await Bell.getBells(userId);
    expect(received).toEqual(expected);

    userId = null;
    received = await Bell.getBells(userId);
    expect(received).toEqual(expected);

    userId = -1;
    received = await Bell.getBells(userId);
    expect(received).toEqual(expected);
  });
});
