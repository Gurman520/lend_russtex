import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';

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
  // Полупроводниковые компаненты
  { name: 'Беспроводные радиочастотные полупроводники', slug: 'besprovodnye-radiochastotnye-poluprovodniki', image: '/images/besprovodnye-radiochastotnye-poluprovodniki.png', parent: 'Полупроводниковые компаненты', order: 1 },
  { name: 'Дискретные полупроводники', slug: 'diskretnye-poluprovodniki', image: '/images/diskretnye-poluprovodniki.png', parent: 'Полупроводниковые компаненты', order: 2 },
  { name: 'Интегральные микросхемы', slug: 'integralnye-mikroshemy', image: '/images/integralnye-mikroshemy.png', parent: 'Полупроводниковые компаненты', order: 3 },
  { name: 'Инженерные средства разработки', slug: 'inzhenernye-sredstva-razrabotki', image: '/images/inzhenernye-sredstva-razrabotki.png', parent: 'Полупроводниковые компаненты', order: 4 },
  { name: 'Память Ics', slug: 'pamyat-ics', image: '/images/pamyat-ics.webp', parent: 'Полупроводниковые компаненты', order: 5 },
  // Пассивные компоненты
  { name: 'Антенны', slug: 'antenny', image: '/images/passiv/antenny.png', parent: 'Пассивные компоненты', order: 1 },
  { name: 'Варисторы', slug: 'varistory', image: '/images/passiv/varistory.png', parent: 'Пассивные компоненты', order: 2 },
  { name: 'Измерительные датчики', slug: 'izmeritelnye-datchiki', image: '/images/passiv/izmeritelnye-datchiki.png', parent: 'Пассивные компоненты', order: 3 },
  { name: 'Индукторы, дроссели и катушки', slug: 'induktory-drosseli-i-katushki', image: '/images/passiv/induktory-drosseli-i-katushki.png', parent: 'Пассивные компоненты', order: 4 },
  { name: 'Конденсаторы', slug: 'kondensatory', image: '/images/passiv/kondensatory.png', parent: 'Пассивные компоненты', order: 5 },
  { name: 'Подстроечные элементы и реостаты', slug: 'podstroechnye-elementy-i-reostaty', image: '/images/passiv/podstroechnye-elementy-i-reostaty.png', parent: 'Пассивные компоненты', order: 6 },
  { name: 'Приборы настройки по частоте и времени', slug: 'pribory-nastrojki-po-chastote-i-vremeni', image: '/images/passiv/pribory-nastrojki-po-chastote-i-vremeni.png', parent: 'Пассивные компоненты', order: 7 },
  { name: 'Резисторы', slug: 'rezistory', image: '/images/passiv/rezistory.png', parent: 'Пассивные компоненты', order: 8 },
  { name: 'Термисторы - NTC', slug: 'termistory-ntc', image: '/images/passiv/termistory-ntc.png', parent: 'Пассивные компоненты', order: 9 },
  { name: 'Термисторы - PTC', slug: 'termistory-ptc', image: '/images/passiv/termistory-ptc.png', parent: 'Пассивные компоненты', order: 10 },
  { name: 'Трансформаторы сигнала', slug: 'transformatory-signala', image: '/images/passiv/transformatory-signala.png', parent: 'Пассивные компоненты', order: 11 },
  { name: 'Ферриты', slug: 'ferrity', image: '/images/passiv/ferrity.png', parent: 'Пассивные компоненты', order: 12 },
  { name: 'Фильтры электромагнитных помех и подавления ЭМП', slug: 'filtry-elektromagnitnyh-pomeh-i-podavleniya-emp', image: '/images/passiv/filtry-elektromagnitnyh-pomeh-i-podavleniya-emp.png', parent: 'Пассивные компоненты', order: 13 },
  { name: 'Формирование сигнала', slug: 'formirovanie-signala', image: '/images/passiv/formirovanie-signala.png', parent: 'Пассивные компоненты', order: 14 },
  // Соединители
  
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Проверяем, есть ли уже категории
    const count = await Category.countDocuments();
    if (count > 0) {
      console.log('Данные уже существуют, пропускаем seed');
      process.exit(0);
    }

    // Создаём корневые категории
    const created = {};
    for (const cat of categories) {
      const doc = await Category.create(cat);
      created[cat.name] = doc._id;
    }

    // Создаём подкатегории
    for (const sub of subcategories) {
      const parentId = created[sub.parent];
      if (parentId) {
        await Category.create({ ...sub, parent: parentId });
      } else {
        console.warn(`Родитель ${sub.parent} не найден`);
      }
    }

    console.log('✅ Категории и подкатегории добавлены');
    process.exit(0);
  } catch (err) {
    console.error('❌ Ошибка seed:', err);
    process.exit(1);
  }
}

seed();
