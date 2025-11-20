import { IValidationErrors } from "../../../types";
import { Component } from "../../base/Component" 
import { ensureElement } from "../../../utils/utils" 
import { IEvents } from "../../base/Events"

export abstract class Form extends Component<HTMLElement> {
    protected formSubmitButtonElement: HTMLButtonElement;
    protected formErrorsElement: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
        this.formSubmitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.formErrorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    set error(message: string) {
        this.formErrorsElement.textContent = message;
    }

    toggleErrorClass(value: boolean): void {
        this.formErrorsElement.classList.toggle('form__errors-active', value);
    }

    resetForm(): void {
        this.clearErrors();
        this.formSubmitButtonElement.toggleAttribute('disabled', true);
    }

    setSubmitEnabled(enabled: boolean): void {
        this.formSubmitButtonElement.disabled = !enabled;
    }

    clearErrors(): void {
        this.formErrorsElement.textContent = '';
    }

    abstract checkValidation(errors: IValidationErrors): boolean;
}