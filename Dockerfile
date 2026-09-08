FROM node:20-alpine

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь проект
COPY . .

# Открываем порт (для внутреннего использования)
EXPOSE 3000

# Команда запуска (будет переопределена в docker-compose)
CMD ["node", "server.js"]