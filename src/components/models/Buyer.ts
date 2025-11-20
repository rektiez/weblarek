import { IBuyer, TPayment, IValidationErrors } from '../../types';

export class Buyer {
  private _payment: TPayment = null;
  private _email = '';
  private _phone = '';
  private _address = '';

  setBuyerNotis(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.address !== undefined) this._address = data.address;
  }

  getBuyerNotis(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clearBuyerNotis(): void {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
  }

  validateBuyerNotis(): IValidationErrors {
    const errors: IValidationErrors = {};
    if (!this._payment) errors.payment = 'Выберите способ оплаты';
    if (!this._email.trim()) errors.email = 'Укажите email';
    if (!this._phone.trim()) errors.phone = 'Укажите телефон';
    if (!this._address.trim()) errors.address = 'Укажите адрес';
    return errors;
  }
}