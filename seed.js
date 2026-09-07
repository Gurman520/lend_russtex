const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');

const categories = [
  { name: 'Полупроводниковые компаненты', slug: 'Poluprovodnikovye-komponenty', 
    description:"Полупроводники являются материалами, чья проводимость лежит между проводниками (например, металлами) и изоляторами (например, стеклом). Основными полупроводниковыми материалами являются кремний (Si) и германий (Ge), хотя также используются и другие материалы. Полупроводниковые компоненты широко применяются в различных устройствах электроники и микроэлектроники"
    , image: '/images/Poluprovodnikovye-komponenty.png', order: 1 },
  { name: 'Пассивные компоненты', slug: 'Passivnye-komponenty', 
    description:'Пассивные компоненты не обладают усиливающими или управляющими свойствами, в отличие от активных компонентов, Вместо этого, пассивные компоненты выполняют основные функции, такие как сопротивление, емкость и индуктивность, которые необходимы для правильного функционирования электронных систем.', 
    image: '/images/Passivnye-komponenty.png', order: 2 },
  { name: 'Оптические компоненты', slug: 'Opticheskie-komponenty', 
    description:'', 
    image: '/images/Opticheskie-komponenty.png', order: 3 },
  { name: 'Дисплеи и индикаторы', slug: 'Displei-i-indikatory', description:'', image: '/images/Displei-i-indikatory.png', order: 4 },
  { name: 'Соединители', slug: 'Soediniteli', 
    description:'Устройства, используемые для соединения электрических проводов, кабелей или компонентов в электрических цепях. Они обеспечивают надежное и безопасное соединение между различными элементами системы и позволяют передавать электрический ток или сигналы между различными компонентами электрической или электронной аппаратуры.', 
    image: '/images/Soediniteli.png', order: 5 },
  { name: 'Испытательное оборудование', slug: 'Ispytatelnoe-oborudovanie', description:'', image: '/images/Ispytatelnoe-oborudovanie.png', order: 6 },
  { name: 'Кожухи', slug: 'Kozhuhi', description:'', image: '/images/Kozhuhi.png', order: 7 },
  { name: 'Видеонаблюдение', slug: 'Videonabljudenie', description:'', image: '/images/Videonabljudenie.png', order: 8 },
  { name: 'Кабели', slug: 'Kabel', description:'', image: '/images/Kabel.png', order: 9 },
  { name: 'Защита от замыкания', slug: 'Zashhita-ot-zamykaniya', description:'', image: '/images/Zashhita-ot-zamykaniya.png', order: 10 },
  { name: 'Промышленная автоматика', slug: 'Promyshlennaya-avtomatika', description:'', image: '/images/Promyshlennaya-avtomatika.png', order: 11 },
  { name: 'Устройства защиты', slug: 'Ustrojstva-zashhity', description:'', image: '/images/Ustrojstva-zashhity.png', order: 12 },
  { name: 'Инструменты и расходники', slug: 'Instrument-i-rashodniki', description:'', image: '/images/Instrument-i-rashodniki.png', order: 13 },
];

const subcategories = [
  { name: 'Беспроводные радиочастотные полупроводники', slug: 'besprovodnye-radiochastotnye-poluprovodniki', image: '/images/besprovodnye-radiochastotnye-poluprovodniki.png', parent: 'Полупроводниковые компаненты', order: 1 },
  { name: 'Дискретные полупроводники', slug: 'diskretnye-poluprovodniki', image: '/images/diskretnye-poluprovodniki.png', parent: 'Полупроводниковые компаненты', order: 2 },
  { name: 'Интегральные микросхемы', slug: 'integralnye-mikroshemy', image: '/images/integralnye-mikroshemy.png', parent: 'Полупроводниковые компаненты', order: 3 },
  { name: 'Инженерные средства разработки', slug: 'inzhenernye-sredstva-razrabotki', image: '/images/inzhenernye-sredstva-razrabotki.png', parent: 'Полупроводниковые компаненты', order: 4 },
  { name: 'Память Ics', slug: 'pamyat-ics', image: '/images/pamyat-ics.webp', parent: 'Полупроводниковые компаненты', order: 5 },
  // ... и т.д.
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Category.deleteMany({});

  // Сначала создаём корневые, запоминаем их id по имени
  const created = {};
  for (const cat of categories) {
    const doc = await Category.create(cat);
    created[cat.name] = doc._id;
  }

  // Теперь подкатегории
  for (const sub of subcategories) {
    const parentId = created[sub.parent];
    if (parentId) {
      await Category.create({ ...sub, parent: parentId });
    } else {
      console.warn(`Родитель ${sub.parent} не найден`);
    }
  }

  console.log('✅ Категории и подкатегории добавлены');
  process.exit();
}

seed().catch(err => { console.error(err); process.exit(1); });


// mongoose.connect(process.env.MONGODB_URI)
//   .then(async () => {
//     await Category.deleteMany({});
//     await Category.insertMany(categories);
//     console.log('Категории добавлены');
//     process.exit();
//   })
//   .catch(err => console.error(err));