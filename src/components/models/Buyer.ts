import { IBuyer, TPayment, IErrors } from '../../types/index.ts';
import { EventEmitter } from "../base/Events";

export class Buyer extends EventEmitter {
  protected  payment: TPayment = 'card';
  protected  email: string = '';
  protected  phone: string = '';
  protected  address: string = '';

  setBuyerData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    this.validateBuyerData();
  }

  setBuyerPayment(value: TPayment) { 
    this.payment = value;
    this.validateBuyerData();
  }

  setBuyerEmail(value: string) {
    this.email = value;
    this.validateBuyerData();
  }

  setBuyerPhone(value: string) {
    this.phone = value;
    this.validateBuyerData();
  }

  setBuyerAddress(value: string) {
    this.address = value;
    this.validateBuyerData();
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.validateBuyerData();
  }

  validateBuyerData(): void {
    const errors: IErrors = {};
    
    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    } 

    if (!this.email || this.email.trim() === '') {
      errors.email = 'Укажите емэйл';
    }

    if(!this.phone || this.phone.trim() === '') {
      errors.phone = 'Укажите номер телефона';
    }

    if(!this.address || this.address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }
    this.emit('form:errors', errors);
  }

  validateOrder(): IErrors {
    const errors: IErrors = {};
    
    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (!this.address || this.address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }

    return errors;
  }

  validateContacts(): IErrors {
    const errors: IErrors = {};
    
    if (!this.email || this.email.trim() === '') {
      errors.email = 'Укажите email';
    }

    if (!this.phone || this.phone.trim() === '') {
      errors.phone = 'Укажите номер телефона';
    }

    return errors;
  }

}