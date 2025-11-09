import { ensureElement, ensureAllElements } from '../../../utils/utils.ts';
import { Component } from '../../base/Component.ts';
import { IEvents } from '../../base/Events.ts';

export type TForm = {
  formElement: HTMLFormElement;
  formErrors: HTMLElement;
  nextButton: HTMLButtonElement;
  formInputs: HTMLInputElement[];
}

export class Form<T = {}> extends Component<TForm & T> {
  protected formElement: HTMLFormElement;
  protected formErrors: HTMLElement;
  protected nextButton: HTMLButtonElement;
  protected formInputs: HTMLInputElement[];

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.formElement = container instanceof HTMLFormElement
    ? container
    : ensureElement<HTMLFormElement>('.form', this.container);
    this.nextButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    
    this.nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.nextButton.disabled) return;
      this.events.emit('order:next');
    });
    this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
    this.formInputs = ensureAllElements<HTMLInputElement>('.form__input', this.container);
  }

  set isButtonValid(value: boolean) {
    this.nextButton.disabled = !value;
  }

  set errors(text: string) {
    if (this.formErrors) {
      this.formErrors.textContent = text;
    }
  }
}