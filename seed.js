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
  
  { name: 'FFC и FPC', slug: 'ffc-i-fpc', image: '/images/soed/ffc-i-fpc.png', parent: 'Соединители', order: 1 },
  { name: 'Автомобильные разъемы', slug: 'avtomobilnye-razemy', image: '/images/soed/avtomobilnye-razemy.png', parent: 'Соединители', order: 2 },
  { name: 'Аудио и видео разъемы', slug: 'audio-i-video-razemy', image: '/images/soed/audio-i-video-razemy.png', parent: 'Соединители', order: 3 },
  { name: 'Волоконно-оптические разъемы', slug: 'volokonno-opticheskie-razemy', image: '/images/soed/volokonno-opticheskie-razemy.png', parent: 'Соединители', order: 4 },
  { name: 'Доска к разъемам доски', slug: 'doska-k-razemam-doski', image: '/images/soed/doska-k-razemam-doski.png', parent: 'Соединители', order: 5 },
  { name: 'Клеммная колодка', slug: 'klemmnaya-kolodka', image: '/images/soed/klemmnaya-kolodka.png', parent: 'Соединители', order: 6 },
  { name: 'Коллекторы', slug: 'kollektory', image: '/images/soed/kollektory.png', parent: 'Соединители', order: 7 },
  { name: 'Компания IC и компонентные гнезда', slug: 'kompaniya-ic-i-komponentnye-gnezda', image: '/images/soed/kompaniya-ic-i-komponentnye-gnezda.png', parent: 'Соединители', order: 8 },
  { name: 'Компоненты Data Bus', slug: 'komponenty-data-bus', image: '/images/soed/komponenty-data-bus.png', parent: 'Соединители', order: 9 },
  { name: 'Контактный разъем и гнездо', slug: 'kontaktnyj-razem-i-gnezdo', image: '/images/soed/kontaktnyj-razem-i-gnezdo.png', parent: 'Соединители', order: 10 },
  { name: 'Круговые соединители', slug: 'krugovye-soediniteli', image: '/images/soed/krugovye-soediniteli.png', parent: 'Соединители', order: 11 },
  { name: 'Мил-спек и индикации неисправности-тип', slug: 'indikaciya-neispravnosti', image: '/images/soed/indikaciya-neispravnosti.png', parent: 'Соединители', order: 12 },
  { name: 'Модульные разъемы', slug: 'modulnye-razemy', image: '/images/soed/modulnye-razemy.png', parent: 'Соединители', order: 13 },
  { name: 'Разъем USB', slug: 'razem-usb', image: '/images/soed/razem-usb.png', parent: 'Соединители', order: 14 },
  { name: 'Разъем питания', slug: 'razem-pitaniya', image: '/images/soed/razem-pitaniya.png', parent: 'Соединители', order: 15 },
  { name: 'Разъемы', slug: 'razemy', image: '/images/soed/razemy.png', parent: 'Соединители', order: 16 },
  { name: 'Разъемы D-Sub', slug: 'razemy-d-sub', image: '/images/soed/razemy-d-sub.png', parent: 'Соединители', order: 17 },
  { name: 'Разъемы I и O', slug: 'razemy-i-i-o', image: '/images/soed/razemy-i-i-o.png', parent: 'Соединители', order: 18 },
  { name: 'Разъемы IEEE 1394', slug: 'razemy-ieee-1394', image: '/images/soed/razemy-ieee-1394.png', parent: 'Соединители', order: 19 },
  { name: 'Разъемы края карточки', slug: 'razemy-kraya-kartochki', image: '/images/soed/razemy-kraya-kartochki.png', parent: 'Соединители', order: 20 },
  { name: 'Разъемы объединительной платы', slug: 'razemy-obedinitelnoj-platy', image: '/images/soed/razemy-obedinitelnoj-platy.png', parent: 'Соединители', order: 21 },
  { name: 'Разъемы оптического волокна', slug: 'razemy-opticheskogo-volokna', image: '/images/soed/razemy-opticheskogo-volokna.png', parent: 'Соединители', order: 22 },
  { name: 'Разъемы освещения', slug: 'razemy-osveshheniya', image: '/images/soed/razemy-osveshheniya.png', parent: 'Соединители', order: 23 },
  { name: 'Разъемы памяти', slug: 'razemy-pamyati', image: '/images/soed/razemy-pamyati.png', parent: 'Соединители', order: 24 },
  { name: 'Системы соединения', slug: 'sistemy-soedineniya', image: '/images/soed/sistemy-soedineniya.png', parent: 'Соединители', order: 25 },
  { name: 'Соединения RF', slug: 'soedineniya-rf', image: '/images/soed/soedineniya-rf.png', parent: 'Соединители', order: 26 },
  { name: 'Солнечные разъемы и фотоэлектрические разъемы', slug: 'solnechnye-razemy-i-fotoelektricheskie-razemy', image: '/images/soed/solnechnye-razemy-i-fotoelektricheskie-razemy.png', parent: 'Соединители', order: 27 },
  { name: 'Терминалы', slug: 'terminaly', image: '/images/soed/terminaly.png', parent: 'Соединители', order: 28 },
  { name: 'Фильтры линии электропередач', slug: 'filtry-linii-elektroperedach', image: '/images/soed/filtry-linii-elektroperedach.png', parent: 'Соединители', order: 29 }
];

async function seed() {
  try {
    dotenv.config();

    await mongoose.connect(process.env.MONGODB_URI, {
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

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
