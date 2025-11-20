import { IBuyer, TPayment } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
  private _payment: TPayment | null = null;
  private _address: string = "";
  private _email: string = "";
  private _phone: string = "";

  constructor(private events: EventEmitter) {}

  setBuyerNotis(data: IBuyer): void {
    this._payment = data.payment;
    this._address = data.address;
    this._email = data.email;
    this._phone = data.phone;
  }

  setPayment(payment: TPayment): void {
    this._payment = payment;
    this.events.emit("buyer:changed", { field: "payment" });
  }

  setAddress(address: string): void {
    this._address = address;
    this.events.emit("buyer:changed", { field: "address" });
  }

  setEmail(email: string): void {
    this._email = email;
    this.events.emit("buyer:changed", { field: "email" });
  }

  setPhone(phone: string): void {
    this._phone = phone;
    this.events.emit("buyer:changed", { field: "phone" });
  }

  getBuyerData(): IBuyer {
    return {
      payment: this._payment as TPayment,
      address: this._address,
      email: this._email,
      phone: this._phone,
    };
  }

  clearBuyerNotis(): void {
    this._payment = null;
    this._address = "";
    this._email = "";
    this._phone = "";
     this.events.emit("buyer:changed", { field: "all" });
  }

  validateBuyerNotis(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this._payment) errors.payment = "Не выбран способ оплаты";
    if (!this._email) errors.email = "Укажите электронную почту";
    if (!this._phone) errors.phone = "Введите номер телефона";
    if (!this._address) errors.address = "Необходим адрес доставки";
    return errors;
  }
}
