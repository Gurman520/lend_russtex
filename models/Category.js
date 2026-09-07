// const mongoose = require('mongoose');

// const CategorySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   image: { type: String, required: true },
//   description: { type: String, default: '' },
//   order: { type: Number, default: 0 }
// });

// module.exports = mongoose.model('Category', CategorySchema);


const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // для красивых URL
  image: { type: String, default: '' },
  description: { type: String, default: '' }, // текст для страницы категории
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, // null = корневая
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Category', CategorySchema);