const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');

const categories = [
  { name: 'Полупроводниковые компаненты', image: '/images/Poluprovodnikovye-komponenty.png', order: 1 },
  { name: 'Пассивные компоненты', image: '/images/Passivnye-komponenty.png', order: 2 },
  { name: 'Оптические компоненты', image: '/images/Opticheskie-komponenty.png', order: 3 },
  { name: 'Дисплеи и индикаторы', image: '/images/Displei-i-indikatory.png', order: 4 },
  { name: 'Соединители', image: '/images/Soediniteli.png', order: 5 },
  { name: 'Испытательное оборудование', image: '/images/Ispytatelnoe-oborudovanie.png', order: 6 },
  { name: 'Кожухи', image: '/images/Kozhuhi.png', order: 7 },
  { name: 'Видеонаблюдение', image: '/images/Videonabljudenie.png', order: 8 },
  { name: 'Кабели', image: '/images/Kabel.png', order: 9 },
  { name: 'Защита от замыкания', image: '/images/Zashhita-ot-zamykaniya.png', order: 10 },
  { name: 'Промышленная автоматика', image: '/images/Promyshlennaya-avtomatika.png', order: 11 },
  { name: 'Устройства защиты', image: '/images/Ustrojstva-zashhity.png', order: 12 },
  { name: 'Инструменты и расходники', image: '/images/Ispytatelnoe-oborudovanie.png', order: 13 },
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log('Категории добавлены');
    process.exit();
  })
  .catch(err => console.error(err));