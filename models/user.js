const { Schema, model } = require('mongoose');
const keys = require('../keys');

const schema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [keys.ROLE.customer, keys.ROLE.seller],
    default: keys.ROLE.customer,
    required: true,
  },
});

module.exports = model('User', schema);
