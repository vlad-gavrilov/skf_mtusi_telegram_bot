require('dotenv').config();
const Schedule = require('../models/Schedule');

describe('Метод getNow', () => {
  test('должен вернуть сообщение о том, что это воскресный день', async () => {
    const msg = {
      from: {
        id: 12345,
      },
      date: 1581856200,
    };

    const expected = '16 февраля 2020 года\n15:30:00\nСегодня воскресенье';
    const received = await Schedule.getNow(msg);

    expect(received).toEqual(expected);
  });

  test('должен вернуть сообщение о том, что сейчас занятий нет (во время 04:30:42)', async () => {
    const msg = {
      from: {
        id: 12345,
      },
      date: 1581903042,
    };

    const expected = '17 февраля 2020 года\n04:30:42\nСейчас занятий нет';
    const received = await Schedule.getNow(msg);

    expect(received).toEqual(expected);
  });

  test('должен вернуть сообщение о том, что сейчас занятий нет (во время 23:30:42)', async () => {
    const msg = {
      from: {
        id: 12345,
      },
      date: 1581971442,
    };

    const expected = '17 февраля 2020 года\n23:30:42\nСейчас занятий нет';
    const received = await Schedule.getNow(msg);

    expect(received).toEqual(expected);
  });

  test('должен вернуть сообщение о том, что сейчас занятий нет (для субботы в 07:30:42)', async () => {
    const msg = {
      from: {
        id: 12345,
      },
      date: 1582345842,
    };

    const expected = '22 февраля 2020 года\n07:30:42\nСейчас занятий нет';
    const received = await Schedule.getNow(msg);

    expect(received).toEqual(expected);
  });

  test('должен вернуть сообщение о том, что сейчас занятий нет (для субботы в 19:30:42)', async () => {
    const msg = {
      from: {
        id: 12345,
      },
      date: 1582389042,
    };

    const expected = '22 февраля 2020 года\n19:30:42\nСейчас занятий нет';
    const received = await Schedule.getNow(msg);

    expect(received).toEqual(expected);
  });

  test('должен вернуть сообщение о том, что сейчас перемена', async () => {
    const msg = {
      from: {
        id: 12345,
      },
      date: 1581512562,
    };

    const expected = '12 февраля 2020 года\n16:02:42\nСейчас перемена';
    const received = await Schedule.getNow(msg);

    expect(received).toEqual(expected);
  });
});
