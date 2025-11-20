import { ensureElement } from "../../../utils/utils"
import { IEvents } from "../../base/Events";
import { Card } from "./Card"; 
import { IProduct } from "../../../types";

export class PreviewCard extends Card {
  protected description: HTMLElement;
  private _inBasket = false;
  protected cardButtonElement: HTMLButtonElement;
  public currentProduct: IProduct | null = null;

  constructor(protected events: IEvents) {
    super(events, '#card-preview');
    this.description = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.cardButtonElement.addEventListener('click', () => {
      if (this.currentProduct) {
        this.events.emit('card:toggle', this.currentProduct);
      }
    });
  }

  render(product: IProduct): HTMLElement {
    this.currentProduct = product;
    this.renderBase(product);
    this.description.textContent = product.description;

    if (product.price === null) {
      this.cardButtonElement.setAttribute('disabled', 'true');
      this.cardButtonElement.textContent = 'Недоступно';
    } else {
      this.cardButtonElement.removeAttribute('disabled');
      this.updateButtonText()
    }
    return this.container;
  }
  
  set inBasket(value: boolean) {
    this._inBasket = value;
    this.updateButtonText();
  }

  private updateButtonText(): void {
    if (this.cardButtonElement.getAttribute('disabled') !== 'true') {
      this.cardButtonElement.textContent = this._inBasket ? 'Удалить из корзины' : 'Купить';
    }
  }
}