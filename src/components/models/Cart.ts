import { IProduct } from '../../types/index.ts';
import { EventEmitter } from "../base/Events";

export class Cart extends EventEmitter {
  protected  productsList: IProduct [] = [];

  getProductsList(): IProduct [] {
    return this.productsList;
  }

  addProduct(product: IProduct): void {
    this.productsList.push(product);
    this.emit('basket:changed');
  }

  removeProduct(product: IProduct): void {
    this.productsList = this.productsList.filter(p => p.id !== product.id);
    this.emit('basket:changed');
  }

  clearCart(): void {
    this.productsList = [];
    this.emit('basket:changed');
  }

  getTotalPrice(): number {
    return this.productsList.reduce((sum, product) => sum + (product.price ?? 0), 0);
  }

  getTotalProducts(): number {
    return this.productsList.length;
  }

  hasProduct(id: string): boolean {
    return this.productsList.some(product => product.id === id);
  }
}