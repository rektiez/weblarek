import { Component } from "../../base/Component" 
import { categoryMap } from "../../../utils/constants";
import { IEvents } from "../../base/Events"
import { CDN_URL } from "../../../utils/constants";
import { IProduct } from "../../../types";
import { cloneTemplate, ensureElement } from "../../../utils/utils" 

export abstract class Card extends Component<IProduct> {
    protected category: HTMLElement;
    protected price: HTMLElement;
    protected image: HTMLImageElement; 
    protected title: HTMLElement;

    constructor(protected evt: IEvents, template: string) {
      super(cloneTemplate<HTMLElement>(template));
      this.category = ensureElement<HTMLElement>('.card__category', this.container);
      this.price = ensureElement<HTMLElement>('.card__price', this.container);
      this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
      this.title = ensureElement<HTMLElement>('.card__title', this.container);
    }

    protected renderBase(product: IProduct): void {
      this.category.className = `card__category ${categoryMap[product.category as keyof typeof categoryMap]}`;
      this.category.textContent = product.category;
      this.setImage(this.image, `${CDN_URL}/${product.image}`, product.title);
      this.title.textContent = product.title;
      this.price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
    }

    abstract render(product: IProduct): HTMLElement;
}