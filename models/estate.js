const { Schema, model } = require('mongoose');
const typeEstate = require('../_helpers/type-estate');

const schema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  floor: { type: Number, required: true },
  rooms: { type: Number, required: true },
  square: { type: Number, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: [typeEstate.rentals, typeEstate.sales],
    required: true,
  },
  img: [{ type: String }],
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Estate', schema);
