import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IValidationErrors } from "../../../types";
import { Form } from "./Form";

export class ContactForms extends Form {
  protected formEmailInputElement: HTMLInputElement;
  protected formTelephoneInputElement: HTMLInputElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container, events);
    this.formEmailInputElement = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.formTelephoneInputElement = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    this.formEmailInputElement.addEventListener("input", () => {
      this.events.emit("contacts:email", {
        email: this.formEmailInputElement.value,
      });
    });

    this.formTelephoneInputElement.addEventListener("input", () => {
      this.events.emit("contacts:phone", {
        phone: this.formTelephoneInputElement.value,
      });
    });

    this.formSubmitButtonElement.addEventListener("click", (event) => {
      event.preventDefault();
      this.events.emit("contacts:submit");
    });
  }

  checkValidation(errors: IValidationErrors): boolean {
    this.clearErrors();
    this.error = errors.email || errors.phone || "";
    return !errors.email && !errors.phone;
  }

  resetForm(): void {
    super.resetForm();
    this.clear();
  }

  clear(): void {
    this.formEmailInputElement.value = "";
    this.formTelephoneInputElement.value = "";
  }
}
