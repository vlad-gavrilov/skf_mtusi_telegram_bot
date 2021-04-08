const mysql = require('mysql2/promise');
const DSN = require('../keys/database');

class GroupHelper {
    static getGroupNameLatin(groupId) {
        const groups = [
            'DV-11',
            'DV-21',
            'DI-11',
            'DI-12',
            'DI-21',
            'DI-22',
            'DP-31',
            'DP-41',
            'DZ-31',
            'DS-31',
            'DZ-41',
        ];
        return groups[groupId];
    }

    static getGroupNameCyrillic(groupId) {
        const groups = [
            'ДВ-11',
            'ДВ-21',
            'ДИ-11',
            'ДИ-12',
            'ДИ-21',
            'ДИ-22',
            'ДП-31',
            'ДП-41',
            'ДЗ-31',
            'ДС-31',
            'ДЗ-41',
        ];
        return groups[groupId];
    }

    static getGroupDepartmentCyrillic(groupId) {
        const departments = [
            '09.03.01 ИВТ',
            '09.03.01 ИВТ',
            '11.03.02 ИТСС',
            '11.03.02 ИТСС',
            '11.03.02 ИТСС',
            '11.03.02 ИТСС',
            '09.03.01 ИВТ',
            '09.03.01 ИВТ',
            '11.03.02 ИТСС, Профиль ЗССС',
            '11.03.02 ИТСС, Профиль СССК',
            '11.03.02 ИТСС, Профиль ЗССС',
        ];
        return departments[groupId];
    }

    static getGroupDepartmentLatin(groupId) {
        const departments = [
            'ivt',
            'ivt',
            'itss',
            'itss',
            'itss',
            'itss',
            'ivt',
            'ivt',
            'itss-zccc',
            'itss-ccck',
            'itss-zccc',
        ];
        return departments[groupId];
    }

    static async getGroupIDs() {
        const connection = await mysql.createConnection(DSN);
        const [rows] = await connection.query('SELECT group_id FROM Groups');
        connection.end();
        return rows;
    }
}

module.exports = GroupHelper;