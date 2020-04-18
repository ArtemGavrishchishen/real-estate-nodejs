const { Schema, model } = require('mongoose');
const role = require('../_helpers/role');

const schema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  password: { type: String, required: true },
  avatarUrl: { type: String },
  role: {
    type: String,
    enum: [role.customer, role.seller],
    default: role.customer,
    required: true,
  },
  resetToken: { type: String },
  resetTokenExp: { type: Date },
});

module.exports = model('User', schema);
