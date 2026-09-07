const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// ---------- API ----------
// Получить все категории
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find({ parent: null }).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить ограниченное количество (для главной)
app.get('/api/categories/preview', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const categories = await Category.find({ parent: null }).sort({ order: 1 }).limit(limit);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- Категории + подкатегории ----------
app.get('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) return res.status(404).json({ error: 'Категория не найдена' });
    // Получаем подкатегории
    const children = await Category.find({ parent: category._id }).sort({ order: 1 }).lean();
    res.json({ category, children });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- Товары категории с пагинацией ----------
app.get('/api/categories/:id/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 40;
    const skip = (page - 1) * limit;

    const categoryId = req.params.id;
    // Проверяем, есть ли подкатегории у этой категории
    const children = await Category.find({ parent: categoryId }).lean();
    let productQuery = { category: categoryId };

    // Если есть подкатегории, то возвращаем товары только этой категории (не включая подкатегории)
    // Но мы можем решить: если есть подкатегории, то не показываем товары на этом уровне (или показываем только товары этой категории)
    // По ТЗ: если есть подкатегории → показываем их, а товары показываем на уровне подкатегорий.
    // Поэтому если есть дети, возвращаем пустой массив товаров.
    if (children.length > 0) {
      return res.json({ products: [], total: 0, page, totalPages: 0 });
    }

    const total = await Product.countDocuments(productQuery);
    const products = await Product.find(productQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// (Опционально) Добавить категорию – для админки позже
app.post('/api/categories', async (req, res) => {
  try {
    const { name, image, description, order } = req.body;
    const newCategory = new Category({ name, image, description, order });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Настройка транспортера для отправки писем (пример для Yandex)
const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',      // SMTP-сервер Яндекса
  port: 465,                    // Порт для защищенного SSL-соединения
  secure: true,                 // true для порта 465
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS
  }
});

// API для получения заявок
app.post('/api/send-request', async (req, res) => {
  const { name, phone, email, company, message } = req.body;

  // Валидация
  if (!name || !phone) {
    return res.status(400).json({ error: 'Имя и телефон обязательны' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.TARGET_MAIL,
    subject: `Новая заявка от ${name}`,
    text: `
      Имя: ${name}
      Телефон: ${phone}
      Email: ${email || 'не указан'}
      Company: ${company || '-'}
      Сообщение: ${message || '—'}
    `,
    html: `
      <h3>Новая заявка с лендинга РусСтекс</h3>
      <p><strong>Имя:</strong> ${name}</p>
      <p><strong>Телефон:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email || 'не указан'}</p>
      <p><strong>Компания:</strong> ${company || 'не указан'}</p>
      <p><strong>Сообщение:</strong> ${message || 'не указан'}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Заявка отправлена' });
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    res.status(500).json({ error: 'Ошибка сервера, попробуйте позже' });
  }
});

// Все остальные запросы отдаём index.html (SPA-режим)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});