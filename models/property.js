const { Schema, model } = require('mongoose');

const course = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  floor: { type: Number, required: true },
  rooms: { type: Number, required: true },
  square: { type: Number, required: true },
  description: { type: String, required: true },
  img: [{ type: String }],
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Property', course);
