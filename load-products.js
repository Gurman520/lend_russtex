import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const CATEGORY_SEPARATOR = '/';

async function getOrCreateCategory(categoryPath) {
  if (!categoryPath) return null;
  const parts = categoryPath.split(CATEGORY_SEPARATOR).map(s => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;

  let parentId = null;
  let currentCategory = null;

  for (const part of parts) {
    let found = await Category.findOne({ name: part, parent: parentId });
    if (!found) {
      const newCat = new Category({
        name: part,
        slug: part.toLowerCase().replace(/\s+/g, '-'),
        parent: parentId,
        order: 0
      });
      found = await newCat.save();
      console.log(`➕ Создана категория: ${part} (родитель: ${parentId || 'корневая'})`);
    }
    parentId = found._id;
    currentCategory = found;
  }
  return currentCategory._id;
}

/**
 * Автоматическое определение разделителя по первой строке
 */
function detectDelimiter(filePath) {
  const firstLine = fs.readFileSync(filePath, 'utf8').split('\n')[0];
  if (firstLine.includes('\t')) return '\t';
  if (firstLine.includes(';')) return ';';
  if (firstLine.includes(',')) return ',';
  return ';'; // по умолчанию
}

async function loadProductsFromCSV(filePath, delimiter) {
  if (!delimiter) {
    delimiter = detectDelimiter(filePath);
    console.log(`🔍 Определён разделитель: "${delimiter}"`);
  }

  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({
        separator: delimiter,
        mapHeaders: ({ header }) => header.trim()
      }))
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`📄 Прочитано ${results.length} строк (включая заголовки?)`);

        let created = 0, updated = 0, errors = 0;

        for (const row of results) {
          try {
            // Ищем поля по разным вариантам
            const sku = row['SKU']?.trim() || row['sku']?.trim() || row['Артикул']?.trim() || row['артикул']?.trim();
            const name = row['Name']?.trim() || row['name']?.trim() || row['Наименование']?.trim() || row['наименование']?.trim();
            const categoriesRaw = row['Categories']?.trim() || row['categories']?.trim() || row['Категория']?.trim() || row['категория']?.trim();

            // Если поля не найдены, пробуем взять все значения подряд (если порядок известен)
            if (!sku && !name) {
              const values = Object.values(row);
              if (values.length >= 3) {
                // Предполагаем порядок: SKU, Name, Categories
                const [skuVal, nameVal, catVal] = values;
                console.log(`🔍 Используем позиционные поля: SKU="${skuVal}", Name="${nameVal}", Categories="${catVal}"`);
                // Можно добавить логику, но лучше привести CSV к правильному формату
                // пока пропускаем
                console.warn(`⚠️ Не удалось определить поля в строке: ${JSON.stringify(row)}`);
                errors++;
                continue;
              }
            }

            if (!sku || !name) {
              console.warn(`⚠️ Пропущена строка из-за отсутствия SKU или Name: ${JSON.stringify(row)}`);
              errors++;
              continue;
            }

            // Создаём/получаем категорию (если есть)
            const categoryId = categoriesRaw ? await getOrCreateCategory(categoriesRaw) : null;
            if (!categoryId) {
              console.warn(`⚠️ Для товара ${sku} не указана категория, пропускаем`);
              errors++;
              continue;
            }

            // Ищем товар по артикулу
            let product = await Product.findOne({ article: sku });
            if (product) {
              product.name = name;
              product.category = categoryId;
              await product.save();
              updated++;
            } else {
              product = new Product({
                name: name,
                article: sku,
                category: categoryId,
              });
              await product.save();
              created++;
            }
          } catch (err) {
            console.error(`❌ Ошибка при обработке строки: ${JSON.stringify(row)}`, err);
            errors++;
          }
        }

        console.log(`✅ Загрузка завершена. Создано: ${created}, Обновлено: ${updated}, Ошибок: ${errors}`);
        resolve({ created, updated, errors });
      })
      .on('error', (err) => reject(err));
  });
}

if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('❌ Укажите путь к CSV-файлу: node load-products.js ./products.csv');
    process.exit(1);
  }

  mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('✅ Подключено к MongoDB');
      await loadProductsFromCSV(filePath);
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Ошибка подключения к БД:', err);
      process.exit(1);
    });
}