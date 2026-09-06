const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Category', CategorySchema);
