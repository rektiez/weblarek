import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrderRequest, IProduct, TPayment } from './types';
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
import { WebLarekApi } from './components/models/WebLarekApi';

const events = new EventEmitter();
const apiService = new WebLarekApi(API_URL);
const productsModel = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);


const basketTemplate = ensureElement<HTMLTemplateElement>("#basket")
const galleryElement = ensureElement<HTMLElement>('.gallery');
const headerElement = ensureElement<HTMLElement>('.header');
const modalElement = ensureElement<HTMLElement>(".modal")
const successTemplate = ensureElement<HTMLTemplateElement>("#success")
const orderFormTemplate = ensureElement<HTMLTemplateElement>("#order")
const contactsFormTemplate = ensureElement<HTMLTemplateElement>("#contacts")


const basket = new Basket(cloneTemplate(basketTemplate), events);
const gallery = new Gallery(galleryElement);
const header = new Header(events, headerElement);
const modal = new Modal(modalElement, events);
const success = new OrderSuccess(cloneTemplate(successTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactForms(cloneTemplate(contactsFormTemplate), events);


apiService
  .fetchProducts()
  .then((products) => {
    productsModel.setProducts(products);
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров:', error);
  })


events.on('catalog:changed', () => {
  const products = productsModel.getProducts();
  const cardElements = products.map((product) => {
    const card = new CatalogCard(events);
    return card.render(product);
  });
  gallery.render({ catalog: cardElements });
})


events.on('product:select', (product: IProduct) => {
  productsModel.setSelected(product);
})


events.on('catalog:selected', (product: IProduct) => {
  const preview = new PreviewCard(events);
  preview.inBasket = cart.hasItem(product.id);
  modal.open(preview.render(product));
})


events.on('card:toggle', (product: IProduct) => {
  const inBasket = cart.hasItem(product.id);
  if (!inBasket) {
    cart.addItem(product)
  }  
  modal.close();
})


events.on('basket:changed', () => {
  header.counter = cart.getCount();
  const renderedCards = cart.getItems().map((product, index) => {
    return new BasketCard(events).render({ ...product, index });
  });
  basket.items = renderedCards;
  basket.total = cart.getTotal();
})


events.on('basket:open', () => {
  modal.open(basket.render());
})


events.on('card:remove', (product: IProduct) => {
  cart.removeItem(product.id);
})

events.on('basket:order', () => {
  modal.open(orderForm.render()); 
})


events.on('payment:change', (data: { payment: TPayment }) => {
  buyer.setPayment(data.payment);
})


events.on('address:change', (data: { address: string }) => {
  buyer.setAddress(data.address);
})


events.on('order:submit', () => {
  modal.content = contactsForm.render();
})


events.on('contacts:email', (data: { email: string }) => {
  buyer.setEmail(data.email);
})


events.on('contacts:phone', (data: { phone: string }) => {
  buyer.setPhone(data.phone);
})


events.on('buyer:changed', (data: { field: string }) => {
  const validation = buyer.validateBuyerNotis();
  const selectedPayment = buyer.getBuyerNotis().payment;

  if (data.field === "payment" || data.field === "address") {
    const isValid = orderForm.checkValidation(validation);
    orderForm.setSubmitEnabled(isValid);
    orderForm.toggleErrorClass(!isValid);
    orderForm.togglePaymentButtonStatus(selectedPayment);
  } else if (data.field === "email" || data.field === "phone") {
    const isValid = contactsForm.checkValidation(validation);
    contactsForm.setSubmitEnabled(isValid);
    contactsForm.toggleErrorClass(!isValid);
  }
})


events.on('contacts:submit', () => {
  const orderData: IOrderRequest = {
    ...buyer.getBuyerNotis(),
    items: cart.getItems().map((product) => product.id),
    total: cart.getTotal(),
  };

  apiService.sendOrder(orderData)
  .then(result => {
      if (result) {
        cart.clear();
        buyer.clearBuyerNotis();
        modal.content = success.render();
        orderForm.resetForm();
        contactsForm.resetForm();
        success.total = result.total;
      }
    })
  .catch(error => console.error('Ошибка оформления заказа:', error))
})


events.on('success:close', () => {
  modal.close();
})