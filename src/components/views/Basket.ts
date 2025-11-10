import { ensureElement } from '../../utils/utils.ts';
import { Component } from '../base/Component.ts';
import { IEvents } from '../base/Events.ts';

interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected listElements: HTMLElement;
  protected priceElements: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.listElements = ensureElement<HTMLElement>('.basket__list', this.container);
    this.priceElements = ensureElement<HTMLElement>('.basket__price', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.basketButton.addEventListener('click',
      () => this.events.emit('basket:ready'));
  }

  set items(elements: HTMLElement[]) {
    if(elements.length === 0) {
      this.listElements.innerHTML = '<div>Корзина пуста</div>';
      this.listElements.classList.add('basket__list_empty');
      this.listElements.classList.remove('basket__list_scroll');
      this.basketButton.disabled = true;
    } else {
      this.listElements.replaceChildren(...elements);
      this.listElements.classList.remove('basket__list_empty');
      this.basketButton.disabled = false;
    }
    if (elements.length > 4) {
        this.listElements.classList.add('basket__list_scroll');
      } else {
        this.listElements.classList.remove('basket__list_scroll');
      }
  }

  set total(value: number) {
    this.priceElements.textContent = `${value} синапсов`;
  }
}