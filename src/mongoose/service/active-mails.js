const { ActiveMails } = require('../models');

/**
 * Get not used active mails
 *
 * @returns {Promise<ActiveMails>}
 */
const getActiveMailNotBlocked = async () => {
  return await ActiveMails.find({
    blocked: false,
  });
};

/**
 * Create a active mail
 * @param {string} mail
 * @returns {Promise<ActiveMails>}
 */
const createActiveMail = async (mail) => {
  return await ActiveMails.create({
    mail: mail,
    code: '',
    blocked: false,
  });
};

module.exports = {
  createActiveMail,
  getActiveMailNotBlocked,
};
