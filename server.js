const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
  const { name, phone, email, message } = req.body;

  // Валидация
  if (!name || !phone) {
    return res.status(400).json({ error: 'Имя и телефон обязательны' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'info@russtecs.ru',    //
    subject: `Новая заявка от ${name}`,
    text: `
      Имя: ${name}
      Телефон: ${phone}
      Email: ${email || 'не указан'}
      Сообщение: ${message || '—'}
    `,
    html: `
      <h3>Новая заявка с лендинга РусТекс</h3>
      <p><strong>Имя:</strong> ${name}</p>
      <p><strong>Телефон:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email || 'не указан'}</p>
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