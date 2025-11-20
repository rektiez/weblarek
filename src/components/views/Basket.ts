import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
  protected basketListElement: HTMLElement;
  protected basketPriceElement: HTMLElement;
  protected basketButtonOrderElement: HTMLButtonElement;
  protected basketTitleElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.basketListElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.basketButtonOrderElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.basketTitleElement = ensureElement<HTMLElement>('.modal__title', this.container);

    this.basketButtonOrderElement.addEventListener('click', () => {
      this.events.emit('basket:order');
    });
  }

  set items(value: HTMLElement[]) {
    if (!value || value.length === 0) {
      this.basketListElement.innerHTML = 'Корзина пуста';
      this.basketListElement.classList.add('basket__list-disabled');
      this.basketButtonOrderElement.disabled = true;
    } else {
      this.basketListElement.replaceChildren(...value);
      this.basketListElement.classList.remove('basket__list-disabled');
      this.basketButtonOrderElement.disabled = false;
    }
  }

  set total(value: number) {
    this.basketPriceElement.textContent = `${value} синапсов`;
  }
}