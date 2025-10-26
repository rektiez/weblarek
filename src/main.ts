import './scss/styles.scss';
import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/Catalog'

import { apiProducts } from './utils/data';


const catalog = new Catalog();

catalog.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getProducts());

const productById = catalog.getProductById('854cef69-976d-4c2a-a18c-2aa45846c398');
console.log('Товар по ID:', productById);

catalog.setSelectedProduct(productById!);
console.log('Выбранный товар:', catalog.getSelectedProduct());


const cart = new Cart();

cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);

console.log('Товары в корзине:', cart.getItems());

console.log('Количество товаров в корзине:', cart.getItemCount());
console.log('Стоимость товаров в корзине:', cart.getTotalPrice());
console.log('Есть ли товар в корзине?', cart.hasItem('854cef69-976d-4c2a-a18c-2aa45846c398'));

cart.removeItem('854cef69-976d-4c2a-a18c-2aa45846c398');
console.log('Товары в корзине после удаления:', cart.getItems());


const buyer = new Buyer();

buyer.setData({
  payment: 'card',
  email: 'test@example.com',
  phone: '+71234567890',
  address: 'Spb Vosstania 1',
});

console.log('Данные покупателя:', buyer.getData());

const validationErrors = buyer.validate();
if (validationErrors) {
  console.log('Ошибки валидации:', validationErrors);
} else {
  console.log('Данные покупателя валидны!');
}

buyer.clear();
console.log('Данные покупателя после очистки:', buyer.getData());
console.log(`Успешно`);


import { WebLarekApi } from './components/models/WebLarekApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

// Создаём экземпляр API-клиента
const apiClient = new Api(API_URL);

// Создаём сервис для работы с сервером
const webLarekApi = new WebLarekApi(apiClient);

// Получаем товары
const products = await webLarekApi.fetchProductsList();
console.log('Товары:', products);

// Отправляем заказ
const orderResponse = await webLarekApi.submitOrder({
  payment: 'card',
  email: 'user@example.com',
  phone: '+71234567890',
  address: 'Spb Vosstania 1',
  items: ['854cef69-976d-4c2a-a18c-2aa45846c398'],
  total: 750,
});
console.log('Ответ сервера:', orderResponse);