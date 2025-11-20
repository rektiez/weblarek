import { ensureElement } from "../../../utils/utils";
import { IErrors } from "../../../types";
import { TPayment } from "../../../types";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";

export class OrderForm extends Form {
  protected formAddressInputElement: HTMLInputElement;
  protected formCardPayButtonElement: HTMLButtonElement;
  protected formCashPayButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.formCardPayButtonElement = ensureElement<HTMLButtonElement>(
      '[name="card"]',
      this.container
    );
    this.formAddressInputElement = ensureElement<HTMLInputElement>(
      '[name="address"]',
      this.container
    );
    this.formCashPayButtonElement = ensureElement<HTMLButtonElement>(
      '[name="cash"]',
      this.container
    );

    this.formCardPayButtonElement.addEventListener("click", () => {
      this.events.emit("payment:change", { payment: "card" });
    });

    this.formSubmitButtonElement.addEventListener("click", (event) => {
      event.preventDefault();
      this.events.emit("order:submit");
    });

    this.formCashPayButtonElement.addEventListener("click", () => {
      this.events.emit("payment:change", { payment: "cash" });
    });

    this.formAddressInputElement.addEventListener("input", () => {
      this.events.emit("address:change", {
        address: this.formAddressInputElement.value,
      });
    });

    this.container.addEventListener("focusin", (event) => {
      if (event.target instanceof HTMLInputElement)
        this.events.emit("input:focus");
    });
  }

  clear(): void {
    this.formAddressInputElement.value = "";
  }

  checkValidation(errors: IErrors): boolean {
    this.clearErrors();
    this.error = errors.payment || errors.address || "";
    return !errors.payment && !errors.address;
  }

  resetForm(): void {
    super.resetForm();
    this.clear();
    this.formCardPayButtonElement.classList.remove("button_alt-active");
    this.formCashPayButtonElement.classList.remove("button_alt-active");
  }

  togglePaymentButtonStatus(status: TPayment): void {
    this.formCardPayButtonElement.classList.toggle(
      "button_alt-active",
      status === "card"
    );
    this.formCashPayButtonElement.classList.toggle(
      "button_alt-active",
      status === "cash"
    );
  }
}
