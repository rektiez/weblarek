import { IBuyer, TPayment, IValidationErrors } from '../../types';
import { EventEmitter } from '../base/Events';

export class Buyer extends EventEmitter {
  private _payment: TPayment = null;
  private _email = '';
  private _phone = '';
  private _address = '';

  // --- Геттеры/сеттеры ---
  get payment(): TPayment { return this._payment; }
  set payment(value: TPayment) {
    this._payment = value;
    this.emit('buyer:changed', { field: 'payment' });
  }

  get email(): string { return this._email; }
  set email(value: string) {
    this._email = value;
    this.emit('buyer:changed', { field: 'email' });
  }

  get phone(): string { return this._phone; }
  set phone(value: string) {
    this._phone = value;
    this.emit('buyer:changed', { field: 'phone' });
  }

  get address(): string { return this._address; }
  set address(value: string) {
    this._address = value;
    this.emit('buyer:changed', { field: 'address' });
  }

  // --- API ---
  getData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  setData(data: Partial<IBuyer>) {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  clear() {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
  }

  // --- Валидация ---
  validateOrder(): IValidationErrors {
    const errors: IValidationErrors = {};
    if (!this._payment) errors.payment = 'Выберите способ оплаты';
    if (!this._address.trim()) errors.address = 'Укажите адрес';
    return errors;
  }

  validateContacts(): IValidationErrors {
    const errors: IValidationErrors = {};
    if (!this._email.trim()) {
      errors.email = 'Укажите email';
    } else if (!/^\S+@\S+\.\S+$/.test(this._email)) {
      errors.email = 'Некорректный email';
    }
    if (!this._phone.trim()) {
      errors.phone = 'Укажите телефон';
    } else if (!/^\+?[\d\-\s()]{10,}$/.test(this._phone)) {
      errors.phone = 'Некорректный телефон';
    }
    return errors;
  }

  validateAll(): IValidationErrors {
    return { ...this.validateOrder(), ...this.validateContacts() };
  }
}