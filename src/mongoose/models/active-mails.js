const mongoose = require('mongoose');

/**
 *
 * @typedef {Object} TActiveMails
 * @property {string} mail
 * @property {string} code
 * @property {boolean} blocked
 */

const activeMailsSchema = mongoose.Schema(
  {
    mail: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: false,
    },
    blocked: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @type {TActiveMails}
 */
const ActiveMails = mongoose.model('ActiveMails', activeMailsSchema);

module.exports = ActiveMails;
