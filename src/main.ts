import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrderRequest, IOrderResponse, IProduct, TPayment, IValidationErrors } from './types';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Catalog } from './components/models/Catalog';
import { BasketCard } from './components/views/Cards/BasketCard';
import { CatalogCard } from './components/views/Cards/CatalogCard';
import { PreviewCard } from './components/views/Cards/PreviewCard';
import { ContactForms } from './components/views/Forms/ContactForms';
import { OrderForm } from './components/views/Forms/OrderForm';
import { Basket } from './components/views/Basket';
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { OrderSuccess } from './components/views/OrderSuccess';

// === Инициализация ===
const events = new EventEmitter();
const api = new Api(API_URL);
const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();

// === DOM-элементы ===
const galleryEl = ensureElement<HTMLElement>('.gallery');
const headerEl = ensureElement<HTMLElement>('.header');
const modalEl = ensureElement<HTMLElement>('.modal');
const basketTpl = ensureElement<HTMLTemplateElement>('#basket');
const successTpl = ensureElement<HTMLTemplateElement>('#success');
const orderTpl = ensureElement<HTMLTemplateElement>('#order');
const contactsTpl = ensureElement<HTMLTemplateElement>('#contacts');

// === Представления ===
// Порядок: (events, container) — согласно вашему KB
const basketView = new Basket(cloneTemplate(basketTpl), events);
const gallery = new Gallery(galleryEl);
const header = new Header(events, headerEl);
const modal = new Modal(modalEl, events);
const successView = new OrderSuccess(cloneTemplate(successTpl), events);
const orderFormView = new OrderForm(events, cloneTemplate(orderTpl));
const contactsFormView = new ContactForms(events, cloneTemplate(contactsTpl));

// === Загрузка товаров ===
api.get<{ items: IProduct[] }>('/product')
  .then(response => {
    catalog.setProducts(response.items);
    events.emit('catalog:changed');
  })
  .catch(err => console.error('Ошибка загрузки каталога', err));

// === Обновление галереи ===
events.on('catalog:changed', () => {
  const products = catalog.getProducts();
  const cards = products.map(product => {
    const card = new CatalogCard(events);
    return card.render(product);
  });
  gallery.catalog = cards;
});

// === Выбор товара — открытие превью ===
events.on('product:select', (product: IProduct) => {
  catalog.setSelected(product);
  const preview = new PreviewCard(events);
  preview.inBasket = cart.hasItem(product.id);
  modal.open(preview.render(product));
});

// === Добавление/удаление из корзины (из превью) ===
events.on('card:toggle', (product: IProduct) => {
  if (cart.hasItem(product.id)) {
    cart.removeItem(product.id);
  } else {
    cart.addItem(product);
  }
  modal.close();
});

// === Обновление корзины и счётчика ===
events.on('basket:changed', () => {
  header.counter = cart.getItemCount();

  const items = cart.getItems();
  const cards = items.map((product, index) => {
    const card = new BasketCard(events);
    return card.render({ ...product, index });
  });

  basketView.items = cards;
  basketView.total = cart.getTotalPrice();
});

// === Открытие корзины ===
events.on('basket:open', () => {
  modal.open(basketView.render());
});

// === Удаление из корзины (из списка) ===
events.on('card:remove', (product: IProduct) => {
  cart.removeItem(product.id);
});

// === Начать оформление заказа ===
events.on('basket:order', () => {
  orderFormView.errors = '';
  modal.open(orderFormView.render());
});

// === Выбор способа оплаты ===
events.on('payment:change', (data: { payment: TPayment }) => {
  buyer.setBuyerNotis({ ...buyer.getBuyerNotis(), payment: data.payment });
});

// === Ввод адреса ===
events.on('address:change', (data: { address: string }) => {
  buyer.setBuyerNotis({ ...buyer.getBuyerNotis(), address: data.address });
});

// === Валидация и переход к контактам ===
events.on('order:submit', () => {
  const errors = buyer.validateBuyerNotis();
  const isValid = !errors.payment && !errors.address;

  if (isValid) {
    contactsFormView.errors = '';
    modal.open(contactsFormView.render());
  } else {
    orderFormView.errors = [errors.payment, errors.address]
      .filter(Boolean)
      .join('\n');
  }
});

// === Ввод email и телефона ===
events.on('contacts:email', (data: { email: string }) => {
  buyer.setBuyerNotis({ ...buyer.getBuyerNotis(), email: data.email });
});

events.on('contacts:phone', (data: { phone: string }) => {
  buyer.setBuyerNotis({ ...buyer.getBuyerNotis(), phone: data.phone });
});

// === Отправка заказа ===
events.on('contacts:submit', () => {
  const errors = buyer.validateBuyerNotis();
  const isValid = !errors.email && !errors.phone;

  if (!isValid) {
    contactsFormView.errors = [errors.email, errors.phone]
      .filter(Boolean)
      .join('\n');
    return;
  }

  const orderData: IOrderRequest = {
    ...buyer.getBuyerNotis(),
    total: cart.getTotalPrice(),
    items: cart.getItems().map(p => p.id),
  };

  api.post<IOrderResponse>('/order', orderData)
    .then(result => {
      cart.clear();
      buyer.clearBuyerNotis();
      successView.total = result.total;
      modal.open(successView.render());
    })
    .catch(err => {
      console.error('Ошибка отправки заказа', err);
      alert('Не удалось оформить заказ');
    });
});

// === Закрытие экрана успеха ===
events.on('success:close', () => {
  modal.close();
});