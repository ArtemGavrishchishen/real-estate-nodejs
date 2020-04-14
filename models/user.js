const { Schema, model } = require('mongoose');
const role = require('../_helpers/role');

const schema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [role.customer, role.seller],
    default: role.customer,
    required: true,
  },
});

module.exports = model('User', schema);
