import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrderRequest, IOrderResponse, IProduct, TPayment } from './types'; // ← убрали IValidationErrors
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Catalog } from './components/models/Catalog';
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
const catalog = new Catalog(events); // ← если конструктор принимает events — OK
const cart = new Cart(events);       // ← если конструктор принимает events — OK
const buyer = new Buyer();           // ← не принимает events

// === DOM-элементы ===
const galleryEl = ensureElement<HTMLElement>('.gallery');
const headerEl = ensureElement<HTMLElement>('.header');
const modalEl = ensureElement<HTMLElement>('.modal');
const basketTpl = ensureElement<HTMLTemplateElement>('#basket');
const successTpl = ensureElement<HTMLTemplateElement>('#success');
const orderTpl = ensureElement<HTMLTemplateElement>('#order');
const contactsTpl = ensureElement<HTMLTemplateElement>('#contacts');

// === Представления ===
// ⚠️ Порядок аргументов — как в конструкторах:
const basketView = new Basket(cloneTemplate(basketTpl), events);   // container, events
const gallery = new Gallery(galleryEl);                            // container
const header = new Header(events, headerEl);                      // events, container ← как в Header.ts
const modal = new Modal(modalEl, events);                         // container, events
const successView = new OrderSuccess(cloneTemplate(successTpl), events);
const orderForm = new OrderForm(events, cloneTemplate(orderTpl)); // events, container
const contactsForm = new ContactForms(events, cloneTemplate(contactsTpl));

// ... остальной код без изменений ...
  // === Загрузка каталога ===
  api.get<{ items: IProduct[] }>('/product')
    .then(response => {
      catalog.setProductsList(response.items);
      events.emit('catalog:changed');
    })
    .catch(err => {
      console.error('Не удалось загрузить товары', err);
    });

  // === Обновление галереи ===
  events.on('catalog:changed', () => {
    const products = catalog.getProductsList();
    const cards = products.map(product => {
      const card = new CatalogCard(events);
      return card.render(product);
    });
    gallery.render({ catalog: cards });
  });

  // === Выбор товара ===
  events.on('product:select', (product: IProduct) => {
    catalog.selectProduct(product);
    const preview = new PreviewCard(events);
    preview.inBasket = cart.hasItem(product.id);
    modal.open(preview.render(product));
  });

  // === Добавление/удаление из корзины ===
  events.on('card:toggle', (product: IProduct) => {
    if (cart.hasItem(product.id)) {
      cart.removeItem(product.id);
    } else {
      cart.addItem(product);
    }
    modal.close();
  });

  // === Обновление корзины ===
  events.on('basket:changed', () => {
    header.counter = cart.count;

    // ✅ Передаём ДАННЫЕ, а не DOM
    const basketItems = cart.items.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price ?? 0, // защищаемся от null
    }));

    basketView.items = basketItems; // ← IBasketItem[]
    basketView.total = cart.total;   // ← number
  });

  // === Открытие корзины ===
  events.on('basket:open', () => {
    modal.open(basketView.render());
  });

  // === Удаление из корзины ===
  events.on('card:remove', (product: IProduct) => {
    cart.removeItem(product.id);
  });

  // === Оформление заказа ===
  events.on('basket:order', () => {
    orderForm.errors = ''; // ← строка, не объект
    modal.open(orderForm.render());
  });

  // === Форма оплаты ===
  events.on('payment:change', (data: { payment: TPayment }) => {
    buyer.payment = data.payment;
  });

  events.on('address:change', (data: { address: string }) => {
    buyer.address = data.address;
  });

  events.on('order:submit', () => {
    const errors = buyer.validateOrder();
    const errorText = Object.values(errors).join('\n') || '';
    orderForm.errors = errorText;
    if (errorText) return;

    contactsForm.errors = '';
    modal.open(contactsForm.render());
  });

  // === Контактная форма ===
  events.on('contacts:email', (data: { email: string }) => {
    buyer.email = data.email;
  });

  events.on('contacts:phone', (data: { phone: string }) => {
    buyer.phone = data.phone;
  });

  events.on('contacts:submit', () => {
    const errors = buyer.validateContacts();
    const errorText = Object.values(errors).join('\n') || '';
    contactsForm.errors = errorText;
    if (errorText) return;

    const orderData: IOrderRequest = {
      ...buyer.getData(),
      total: cart.total,
      items: cart.items.map(p => p.id),
    };

    api.post<IOrderResponse>('/order', orderData)
      .then(result => {
        cart.clear();
        buyer.clear();
        successView.total = result.total;
        modal.open(successView.render());
      })
      .catch(err => {
        console.error('Ошибка заказа', err);
        alert('Не удалось оформить заказ');
      });
  });

  // === Закрытие успеха ===
  events.on('success:close', () => {
    modal.close();
  });