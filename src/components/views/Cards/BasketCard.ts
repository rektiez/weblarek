import { IEvents } from '../../base/Events.ts';
import { ensureElement } from '../../../utils/utils.ts';
import { Card, TCard } from './Card.ts';

export type TCardBasket = {index: number} & TCard;

export class CardBasket extends Card<TCardBasket> {
  protected indexElement: HTMLElement;
  protected itemDeleteButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.itemDeleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    this.itemDeleteButton.addEventListener('click', () => 
      this.events.emit('card:delete', { card: this.id}));
  }
  
  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }

}