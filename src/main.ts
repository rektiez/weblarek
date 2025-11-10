import './scss/styles.scss';
import { Catalog } from './components/models/Catalog';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { IOrderRequest, TPayment } from './types';
import { WebLarekApi } from './components/models/WebLarekApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Basket } from './components/views/Basket';
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { OrderSuccess } from './components/views/OrderSucces';
import { CardBasket } from './components/views/Cards/BasketCard';
import { CardCatalog } from './components/views/Cards/CatalogCard';
import { CardPreview } from './components/views/Cards/PreviewCard';
import { ContactsForm } from './components/views/Forms/ContactForms';
import { OrderForm } from './components/views/Forms/OrderForm';
import { ensureElement, cloneTemplate } from './utils/utils';

const events = new EventEmitter();

const productsModel = new Catalog();
const cartModel = new Cart();
const buyerModel = new Buyer();

const api = new Api(API_URL);
const larekApi = new WebLarekApi(api);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('.modal'));

const orderSuccessTempl = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTempl = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTempl = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTempl = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTempl = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTempl = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTempl = ensureElement<HTMLTemplateElement>('#contacts');

const basket = new Basket(events, cloneTemplate(basketTempl));
const orderForm = new OrderForm(events, cloneTemplate(orderFormTempl));
const contactsForm = new ContactsForm(events, cloneTemplate(contactsFormTempl));
const orderSuccess = new OrderSuccess(events, cloneTemplate(orderSuccessTempl));

function renderCatalog() {
  const products = productsModel.getProductsList();
  const items = products.map((item) => {
    const card = new CardCatalog(events, cloneTemplate(cardCatalogTempl));
    return card.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
  gallery.render({ catalog: items });
}

productsModel.on('catalog:changed', () => renderCatalog());

events.on('card:open', (data: { card: string }) => {
  const product = productsModel.getProductById(data.card);
  if (!product) return;

  const cardPreview = new CardPreview(events, cloneTemplate(cardPreviewTempl));
  const inCart = cartModel.hasProduct(product.id);

  const previewData = {
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description,
    inCart: inCart,
    disabled: product.price === null
  };

  const previewElement = cardPreview.render(previewData);
  modal.content = previewElement;
  modal.open();
  
  if (product.price === null) {
    cardPreview.disableButton();
  }
});

events.on('card:add', (data: { card: string }) => {
  const product = productsModel.getProductById(data.card);
  if (product && product.price !== null) {
    cartModel.addProduct(product);
  }
});

events.on('card:delete', (data: { card: string }) => {
  const product = productsModel.getProductById(data.card);
  if (product) {
    cartModel.removeProduct(product);
  }
});

function renderBasket() {
  const products = cartModel.getProductsList();
  const items = products.map((item, index) => {
    const card = new CardBasket(events, cloneTemplate(cardBasketTempl));
    card.index = index + 1;
    return card.render(item);
  });
  basket.items = items;
  basket.total = cartModel.getTotalPrice();
}

events.on('basket:open', () => {
  renderBasket();
  modal.content = basket.render();
  modal.open();
});

cartModel.on('basket:changed', () => {
  header.counter = cartModel.getTotalProducts();
  renderBasket();
  
  const currentPreview = document.querySelector('.modal_active .card_full');
  if (currentPreview) {
    const productId = currentPreview.id;
    const inCart = cartModel.hasProduct(productId);
    const button = currentPreview.querySelector('.card__button') as HTMLButtonElement;
    
    if (button) {
      button.textContent = inCart ? 'Удалить из корзины' : 'Купить';
    
      if (inCart) {
        button.setAttribute('data-in-cart', 'true');
      } else {
        button.removeAttribute('data-in-cart');
      }
    }
  }
});

events.on('basket:ready', () => {
  if (cartModel.getTotalProducts() === 0) {
    return;
  }
  
  buyerModel.clear();
  const buyer = buyerModel.getBuyerData();
  orderForm.payment = buyer.payment;
  orderForm.addressValue = buyer.address;

  modal.content = orderForm.render();
  modal.open();
});

buyerModel.on('form:errors', (errors: any) => {
  orderForm.validateForm(errors);
  contactsForm.validateForm(errors);
});

events.on('order:change', (data: { field: string; value: string }) => {
  if (data.field === 'payment') {
    buyerModel.setBuyerPayment(data.value as TPayment);
  } else if (data.field === 'address') {
    buyerModel.setBuyerAddress(data.value);
  } else if (data.field === 'email') {
    buyerModel.setBuyerEmail(data.value);
  } else if (data.field === 'phone') {
    buyerModel.setBuyerPhone(data.value);
  }
});

events.on('order:next', () => {
  const buyer = buyerModel.getBuyerData();
  contactsForm.emailValue = buyer.email;
  contactsForm.phoneValue = buyer.phone;
  
  modal.content = contactsForm.render();
});

events.on('contacts:submit', () => {
  const buyer = buyerModel.getBuyerData();

   const orderData: IOrderRequest = {
    ...buyer,
    total: cartModel.getTotalPrice(),
    items: cartModel.getProductsList().map(product => product.id)
  }

  larekApi
    .submitOrder(orderData)
    .then(() => {
      cartModel.clearCart();
      buyerModel.clear();
      orderSuccess.total = orderData.total;
      modal.content = orderSuccess.render();
    })
    .catch((error) => {
      console.error('Ошибка оформления заказа:', error);
    });
});
    
events.on('success:closed', () => {
  modal.close();
});

larekApi
  .fetchProductsList()
  .then((products) => {
    productsModel.setProductsList(products);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров: ', error);
  });