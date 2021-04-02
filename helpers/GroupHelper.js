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
}

module.exports = GroupHelper;