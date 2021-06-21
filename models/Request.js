const axios = require('axios');
const GroupHelper = require('../helpers/GroupHelper');
const { logError } = require('./Logger');

class Request {
  static async getScheduleFromSite(groupId) {
    let scheduleHTML = '';

    const groupNameCyrillic = GroupHelper.getGroupNameCyrillic(groupId);
    const groupDepartmentLatin = GroupHelper.getGroupDepartmentLatin(groupId);

    try {
      const config = {
        method: 'post',
        baseURL: 'http://skf-mtusi.ru/rasp',
        url: '/group.php',
        data: {
          kurs: groupDepartmentLatin,
          gr: groupNameCyrillic,
        },
      };

      const response = await axios(config);

      if (response.status < 300) {
        scheduleHTML = response.data;
      }
    } catch (error) {
      logError(error);
    }

    return scheduleHTML;
  }
}

module.exports = Request;
