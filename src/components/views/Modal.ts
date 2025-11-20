import { Component } from "../base/Component" 
import { ensureElement } from "../../utils/utils" 
import { IEvents } from "../base/Events"

export class Modal extends Component<HTMLElement> {
  protected modalContentElement: HTMLElement;
  protected modalCloseButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected evt: IEvents) {
    super(container);
    this.modalContentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.modalCloseButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);  

    this.modalCloseButtonElement.addEventListener('click', () => {
      this.close();
    });

    this.container.addEventListener('click', (event: MouseEvent) => {
      if (event.target === event.currentTarget) {
        this.close()
      }
    });
  }

  set content(value: HTMLElement){
    this.modalContentElement.replaceChildren(value);
  }

  open(content: HTMLElement) {
    this.container.classList.add('modal_active');
    this.modalContentElement.replaceChildren(content);
  }

  close() {
    this.container.classList.remove('modal_active');
    this.evt.emit('modal:close');
  }
}