const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  article: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  manufacturer: { type: String, default: '' },
  description: { type: String, default: '' },
  // цена опционально
  price: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', ProductSchema);