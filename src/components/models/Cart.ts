import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Cart extends EventEmitter {
  private _items: IProduct[] = [];

  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this._items.push(product);
      this.emit('basket:changed');
    }
  }

  removeItem(id: string): void {
    const index = this._items.findIndex(p => p.id === id);
    if (index !== -1) {
      this._items.splice(index, 1);
      this.emit('basket:changed');
    }
  }

  clear(): void {
    this._items = [];
    this.emit('basket:changed');
  }

  getItems(): IProduct[] {
    return [...this._items];
  }

  getItemCount(): number {
    return this._items.length;
  }

  getTotalPrice(): number {
    return this._items.reduce((sum, p) => sum + (p.price || 0), 0);
  }

  hasItem(id: string): boolean {
    return this._items.some(p => p.id === id);
  }
}