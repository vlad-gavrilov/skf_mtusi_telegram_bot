const axios = require('axios');
const GroupHelper = require('../helpers/GroupHelper');

class Request {
    static async getScheduleFromSite(groupId) {
        let scheduleHTML = '';

        let groupNameCyrillic = GroupHelper.getGroupNameCyrillic(groupId);
        let groupDepartmentLatin = GroupHelper.getGroupDepartmentLatin(groupId);

        try {
            let config = {
                method: 'post',
                baseURL: 'http://skf-mtusi.ru/rasp',
                url: '/group.php',
                data: {
                    kurs: groupDepartmentLatin,
                    gr: groupNameCyrillic
                }
            };

            const response = await axios(config);

            if (response.status < 300) {
                scheduleHTML = response.data;
            }
        } catch (error) {
            console.log(error);
        }

        return scheduleHTML;
    }
};

module.exports = Request;