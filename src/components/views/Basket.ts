import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IBasketItem {
  id: string;
  title: string;
  price: number;

}

export interface IBasketView {
  readonly items: IBasketItem[];
  readonly total: number;
}

export class Basket extends Component<IBasketView> {
  private _listEl: HTMLElement;
  private _priceEl: HTMLElement;
  private _titleEl?: HTMLElement; // опционально — не все модалки имеют заголовок
  private _buttonEl: HTMLButtonElement;

  private _items: IBasketItem[] = [];
  private _total = 0;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._listEl = ensureElement<HTMLElement>('.basket__list', this.container);
    this._priceEl = ensureElement<HTMLElement>('.basket__price', this.container);
    this._buttonEl = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    // Заголовок — опционален (защита от ошибки, если его нет)
    const titleCandidate = this.container.querySelector<HTMLElement>('.modal__title');
    if (titleCandidate) {
      this._titleEl = titleCandidate;
      this._updateTitle();
    }

    this._buttonEl.addEventListener('click', () => {
      this.events.emit('basket:order');
    });

    // Инициализируем в пустом состоянии
    this.items = [];
  }

  // --- Сеттеры (публичный API) ---

  set items(items: IBasketItem[]) {
    this._items = items;
    this._updateList();
    this._updateButtonState();
    if (this._titleEl) this._updateTitle();
  }

  set total(value: number) {
    this._total = value;
    this._updatePrice();
  }

  // --- Приватные методы отрисовки ---

  private _updateList() {
    if (this._items.length === 0) {
      this._listEl.innerHTML = '<div class="basket__empty">Корзина пуста</div>';
      this._listEl.classList.add('basket__list_empty');
      this._listEl.classList.remove('basket__list_scroll');
    } else {
      // Рендерим элементы (можно вынести в отдельный компонент BasketItem)
      const itemsHtml = this._items.map(item => `
        <li class="basket__item" data-id="${item.id}">
          <span class="basket__item-title">${this.escapeHtml(item.title)}</span>
          <span class="basket__item-price">${item.price} синапсов</span>
        </li>
      `).join('');

      this._listEl.innerHTML = `<ul class="basket__items">${itemsHtml}</ul>`;
      this._listEl.classList.remove('basket__list_empty');

      // Добавляем скролл при >4 элементах
      if (this._items.length > 4) {
        this._listEl.classList.add('basket__list_scroll');
      } else {
        this._listEl.classList.remove('basket__list_scroll');
      }
    }
  }

  private _updatePrice() {
    this._priceEl.textContent = `${this._total} синапсов`;
  }

  private _updateTitle() {
    if (this._titleEl) {
      this._titleEl.textContent = this._items.length === 0
        ? 'Ваша корзина'
        : `В корзине ${this._items.length} ${this._getDeclension(this._items.length, ['товар', 'товара', 'товаров'])}`;
    }
  }

  private _updateButtonState() {
    this._buttonEl.disabled = this._items.length === 0;
  }

  // --- Вспомогательные утилиты ---

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Склонение числительных (1 товар, 2 товара, 5 товаров)
  private _getDeclension(number: number, titles: [string, string, string]): string {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  }
}