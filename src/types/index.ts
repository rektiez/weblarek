// src/types/index.ts

export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[];
  total: number;
}

export interface IOrderResponse {
  id: string;
  total: number;
}

// Используется в BuyerModel
export interface IErrors {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Для форм
export interface IValidationErrors extends IErrors {}