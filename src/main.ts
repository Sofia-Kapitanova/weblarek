import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { ProductsData } from "./components/Models/ProductsData";
import { BasketData } from "./components/Models/BasketData";
import { BuyerData } from "./components/Models/BuyerData";
import { LarekApi } from "./components/Models/LarekApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

// 1. Инициализация брокера событий и логирования
const events = new EventEmitter();
events.onAll((event) => {
  console.log(
    ` [Событие брокера]: ${String(event.eventName)}`,
    event.data || "",
  );
});

// 2. Создание экземпляров ВСЕХ созданных классов (Выполнение ТЗ)
const api = new LarekApi(CDN_URL, API_URL);
const productsModel = new ProductsData(events);
const basketModel = new BasketData(events);
const buyerModel = new BuyerData(events);

console.log("\n--- СТАРТ: ЗАПРОС К СЕРВЕРУ ЗА ДАННЫМИ КАТАЛОГА ---");

// 3. Запрос к реальному серверу (Выполнение ТЗ)
api
  .getProductsList()
  .then((res) => {
    // Склеиваем префикс CDN и относительный путь к картинке здесь, в презентере
    const productsWithCdn = res.items.map((item) => ({
      ...item,
      image: api.cdn + item.image,
    }));

    console.log(
      ` Данные успешно получены с сервера! Найдено товаров: ${productsWithCdn.length}`,
    );

    // ==========================================
    // ТЕСТ 1: Модель каталога товаров (ProductsData)
    // ==========================================
    console.log("\n---  Тест модели ProductsData ---");

    // Сохранение массива в модели данных
    productsModel.setProducts(productsWithCdn);
    // Вывод массива в консоль с использованием метода класса
    console.log(
      " Массив всех товаров из каталога:",
      productsModel.getProducts(),
    );

    // Проверяем получение одного товара по ID
    const firstProduct = productsModel.getProducts()[0];
    if (firstProduct) {
      const singleProduct = productsModel.getProduct(firstProduct.id);
      console.log(
        ` Товар, найденный по ID (${firstProduct.id}):`,
        singleProduct,
      );

      // Проверяем работу превью товара
      productsModel.setPreviewProduct(firstProduct);
      console.log(" Товар в превью:", productsModel.getPreviewProduct());
    }

    // ==========================================
    // ТЕСТ 2: Модель корзины (BasketData)
    // ==========================================
    console.log("\n---  Тест модели BasketData ---");

    if (productsWithCdn.length >= 2) {
      // Добавляем товары в корзину
      basketModel.add(productsWithCdn[0]);
      basketModel.add(productsWithCdn[1]);
      console.log(
        " Вывод товаров в корзине (getItems()):",
        basketModel.getItems(),
      );
      console.log(" Проверка getTotalPrice():", basketModel.getTotalPrice());

      // Удаляем один товар
      basketModel.remove(productsWithCdn[0].id);
      console.log(
        ` После удаления товара ${productsWithCdn[0].id} (getItems()):`,
        basketModel.getItems(),
      );
      console.log(" Пересчитанная сумма заказа:", basketModel.getTotalPrice());
    }

    // ==========================================
    // ТЕСТ 3: Модель покупателя (BuyerData)
    // ==========================================
    console.log("\n---  Тест модели BuyerData ---");

    // Заполняем данные через методы класса
    buyerModel.setField("payment", "card");
    buyerModel.setField("address", "ул. Ленина, д. 10");
    buyerModel.setField("email", "user@test.com");
    buyerModel.setField("phone", "+79991234567");

    // Выводим данные в консоль, полученные через метод класса
    console.log(
      " Данные покупателя из модели (getBuyerData()):",
      buyerModel.getBuyerData(),
    );

    // ЭТАП РУЧНОГО ТЕСТИРОВАНИЯ С ДАННЫМИ ИЗ ФАЙЛА data.ts

    console.log(
      "\n--- СТАРТ: ЭТАП РУЧНОГО ТЕСТИРОВАНИЯ С ДАННЫМИ ИЗ ФАЙЛА DATA.TS ---",
    );
    // Включаем логирование всех событий в консоль, чтобы видеть работу моделей через emit
    events.onAll((event) => {
      console.log(
        `📡 [Событие брокера]: ${String(event.eventName)}`,
        event.data,
      );
    });

    // ==========================================
    // 1. ТЕСТИРОВАНИЕ КАТАЛОГА ТОВАРОВ (ProductsData)
    // ==========================================
    console.log("--- 📦 Тест модели ProductsData ---");

    // Исправлено: Склеиваем префикс CDN и относительный путь к картинке для локальных данных
    const localProductsWithCdn = apiProducts.items.map((item) => ({
      ...item,
      image: api.cdn + item.image, // используем инстанс api, который создан выше в файле
    }));

    // Проверяем сохранение товаров с корректными ссылками
    productsModel.setProducts(localProductsWithCdn);
    console.log(
      "🛒 Массив всех товаров из каталога:",
      productsModel.getProducts(),
    );

    // Проверяем получение одного товара по ID (берем ID первого товара из обработанного списка)
    const firstProductId = localProductsWithCdn[0]?.id;
    if (firstProductId) {
      const singleProduct = productsModel.getProduct(firstProductId);
      console.log(
        `🔍 Товар найденный по ID (${firstProductId}):`,
        singleProduct,
      );
    }

    // Проверяем работу превью (выбора товара для модального окна)
    productsModel.setPreviewProduct(localProductsWithCdn[0]);
    console.log("👁️ Товар в превью:", productsModel.getPreviewProduct());

    // ==========================================
    // 2. ТЕСТИРОВАНИЕ КОРЗИНЫ (BasketData)
    // ==========================================
    console.log("\n--- 🛍️ Тест модели BasketData ---");

    // Проверяем добавление товаров в корзину
    const testProduct1 = apiProducts.items[0];
    const testProduct2 = apiProducts.items[1];

    if (testProduct1 && testProduct2) {
      basketModel.add(testProduct1);
      basketModel.add(testProduct2);

      // Пробуем добавить дубликат (сработать не должно)
      basketModel.add(testProduct1);

      console.log("👜 Список товаров в корзине:", basketModel.getItems());
      console.log(
        "🔢 Количество товаров в корзине (ожидаем 2):",
        basketModel.getCounter(),
      );
      console.log("💰 Общая стоимость товаров:", basketModel.getTotalPrice());
      console.log(
        `❓ Проверка наличия первого товара (ожидаем true):`,
        basketModel.checkItem(testProduct1.id),
      );

      // Проверяем удаление одного товара
      basketModel.remove(testProduct1.id);
      console.log(
        "🗑️ Корзина после удаления первого товара:",
        basketModel.getItems(),
      );
      console.log(
        "🔢 Новый счетчик товаров (ожидаем 1):",
        basketModel.getCounter(),
      );

      // Проверяем полную очистку
      basketModel.clear();
      console.log("🧹 Корзина после полной очистки:", basketModel.getItems());
    }

    // ==========================================
    // 3. ТЕСТИРОВАНИЕ ДАННЫХ ПОКУПАТЕЛЯ (BuyerData)
    // ==========================================
    console.log("\n--- 👤 Тест модели BuyerData ---");

    // Проверяем частичное заполнение полей
    buyerModel.setField("address", "ул. Ленина, д. 10");
    buyerModel.setField("email", "test@yandex.ru");

    // Проверяем промежуточную валидацию (должны остаться ошибки для payment и phone)
    console.log(
      "❌ Текущие ошибки валидации (ожидаем payment и phone):",
      buyerModel.validate(),
    );

    // Дозаполняем оставшиеся поля
    buyerModel.setField("payment", "cash");
    buyerModel.setField("phone", "+79991112233");

    // Проверяем финальную валидацию (объект ошибок должен быть пустым)
    const finalErrors = buyerModel.validate();
    console.log(
      "✅ Ошибки валидации после полного заполнения (должен быть пустой объект):",
      finalErrors,
    );
    console.log(
      "📝 Итоговые данные покупателя из модели:",
      buyerModel.getBuyerData(),
    );

    // Проверяем очистку данных
    buyerModel.clear();
    console.log(
      "🔲 Данные покупателя после очистки:",
      buyerModel.getBuyerData(),
    );
  })
  .catch((err) => {
    console.error(" Ошибка при выполнении сценария тестирования:", err);
  });
