import { ensureElement } from "../../utils/utils" 
import { Component } from "../base/Component" 
import { IEvents } from "../base/Events"
import { IOrderResponse } from "../../types";




export class OrderSuccess extends Component<IOrderResponse> {
  protected orderTitleElement: HTMLElement;
  protected orderButtonCloseElement: HTMLButtonElement;
  protected description: HTMLElement;

  constructor(container: HTMLElement, protected evt: IEvents) {
    super(container)
    this.description = ensureElement<HTMLElement>('.order-success__description', container); 
    this.orderTitleElement = ensureElement<HTMLElement>('.order-success__title', container); 
    this.orderButtonCloseElement = ensureElement<HTMLButtonElement>('.order-success__close', container);  

    this.orderButtonCloseElement.addEventListener('click', () => {
      this.evt.emit('success:close');
    });
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}