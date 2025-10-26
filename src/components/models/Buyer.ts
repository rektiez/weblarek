import { IBuyer, TPayment, IErrors } from '../../types';

export class Buyer {
  private _payment: TPayment = null;
  private _email: string = '';
  private _phone: string = '';
  private _address: string = '';

  // Обновить любые поля
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.address !== undefined) this._address = data.address;
  }

  // Геттеры
  get payment(): TPayment { return this._payment; }
  get email(): string { return this._email; }
  get phone(): string { return this._phone; }
  get address(): string { return this._address; }

  // Получить все данные как объект
  getData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  // Очистить
  clear(): void {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
  }

  // Валидация
  validate(): IErrors {
    const errors: IErrors = {};

    if (this._payment === null) errors.payment = 'Выберите способ оплаты';
    if (!this._email.trim()) errors.email = 'Укажите email';
    if (!this._phone.trim()) errors.phone = 'Укажите телефон';
    if (!this._address.trim()) errors.address = 'Укажите адрес';

    return errors;
  }
}