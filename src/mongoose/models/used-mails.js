const mongoose = require('mongoose');

/**
 *
 * @typedef {Object} TUsedMails
 * @property {string} mail
 * @property {boolean} isDone
 * @property {boolean} isDeleted
 */

const usedMailsSchema = mongoose.Schema(
  {
    mail: {
      type: String,
      required: true,
      unique: true,
    },
    isDone: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @type {TUsedMails}
 */
const UsedMails = mongoose.model('UsedMails', usedMailsSchema);

module.exports = UsedMails;
