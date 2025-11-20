import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";


interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketData> {
  protected basketListElement: HTMLElement;
  protected basketPriceElement: HTMLElement;
  protected basketTitleElement: HTMLElement;
  protected basketButtonOrderElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.basketButtonOrderElement = ensureElement<HTMLButtonElement>(
      '.basket__button',
      this.container
    );
    this.basketTitleElement = ensureElement<HTMLElement>(
      '.modal__title',
      this.container
    );
    this.basketPriceElement = ensureElement<HTMLElement>(
      '.basket__price',
      this.container
    );
    this.basketListElement = ensureElement<HTMLElement>(
      '.basket__list',
      this.container
    );

    // Устанавливаем начальное состояние (пустая корзина)
    this.items = [];

    // Обработчик клика по кнопке заказа
    this.basketButtonOrderElement.addEventListener('click', () => {
      this.events.emit('basket:order');
    });
  }

  /**
   * Сеттер для управления списком товаров в корзине
   * @param value - массив HTMLElement или null/undefined
   */
  set items(value: HTMLElement[] | undefined | null) {
    if (!value || value.length === 0) {
      // Корзина пуста
      this.basketListElement.innerHTML = 'Корзина пуста';
      this.basketListElement.classList.add('basket__list-disabled');
      this.basketButtonOrderElement.disabled = true;
    } else {
      // Есть товары в корзине
      this.basketListElement.replaceChildren(...value);
      this.basketListElement.classList.remove('basket__list-disabled');
      this.basketButtonOrderElement.disabled = false;
    }
  }

  /**
   * Сеттер для отображения общей стоимости
   * @param value - числовое значение суммы
   */
  set total(value: number) {
    this.basketPriceElement.textContent = `${value} синапсов`;
  }
}