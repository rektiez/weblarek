import { ensureElement } from '../../utils/utils.ts';
import { Component } from '../base/Component.ts';

interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

   constructor(container?: HTMLElement) {
    super(container || ensureElement<HTMLElement>('.gallery'));
    this.catalogElement = this.container;
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}
