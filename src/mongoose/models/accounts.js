const mongoose = require('mongoose');

/**
 *
 * @typedef {Object} TAccount
 * @property {string} mail
 * @property {string} code
 * @property {boolean} blocked
 */

const accountSchema = mongoose.Schema(
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
 * @type {TAccount}
 */
const Accounts = mongoose.model('Accounts', accountSchema);

module.exports = Accounts;
