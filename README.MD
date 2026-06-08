# РусCтекс — лендинг для поставок микроэлектроники

## Быстрый старт

```bash
npm install
touch .env   # настройте почтовые данные
npm start
```

Сервер запустится на `http://localhost:3000`

## Структура

- `public/` — статика (HTML, CSS, JS)
- `server.js` — Express + Nodemailer

## Переменные окружения (.env)

```
EMAIL_USER=your@yandex.ru
EMAIL_PASS=app_password
PORT=3000
```

## Продакшен

```bash
pm2 start server.js --name rusteks
```

## Карта

Используется iframe Яндекс.Карт — замените ссылку в `index.html` при необходимости.
