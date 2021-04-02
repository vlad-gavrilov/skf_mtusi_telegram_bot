class TimeHelper {
    static getMonthName(number) {
        const months = [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря'
        ];
        return months[number];
    }

    static getWeekdayName(number) {
        const weekdays = [
            'воскресенье',
            'понедельник',
            'вторник',
            'среда',
            'четверг',
            'пятница',
            'суббота',
        ];
        return weekdays[number];
    }

    

    static buildStringHoursAndMinutes(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if (hours.toString().length === 1) hours = '0' + hours;
        if (minutes.toString().length === 1) minutes = '0' + minutes;
        return hours + ':' + minutes;
    }

    static buildStringHoursAndMinutesAndSeconds(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if (hours.toString().length === 1) hours = '0' + hours;
        if (minutes.toString().length === 1) minutes = '0' + minutes;
        if (seconds.toString().length === 1) seconds = '0' + seconds;
        return hours + ':' + minutes + ':' + seconds;
    }

    static minutesPassedSinceMidnight(date) {
        return date.getHours() * 60 + date.getMinutes()
    }

    static getFormatedStringFromDate(date) {
        let outputString = `${date.getDate()} ${TimeHelper.getMonthName(date.getMonth())} ${date.getFullYear()} года\n`;
        outputString += `${TimeHelper.buildStringHoursAndMinutesAndSeconds(date)}\n`;
        return outputString;
    }

    static getFormatedStringWithWeekdayFromDate(date) {
        let outputString = `${date.getDate()} ${TimeHelper.getMonthName(date.getMonth())} ${date.getFullYear()} года, `;
        outputString += `${TimeHelper.getWeekdayName(date.getDay())}\n`;
        return outputString;
    }

    static getFormatedDayAndMonthFromDate(date) {
        let outputString = `${date.getDate()} ${TimeHelper.getMonthName(date.getMonth())}`;
        return outputString;
    }
}

module.exports = TimeHelper;