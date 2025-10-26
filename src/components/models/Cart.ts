import { IProduct } from '../../types';

export class Cart {
  private _items: IProduct[] = [];

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(product: IProduct): void {
    this._items.push(product);
  }

  removeItem(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
  }

  clear(): void {
    this._items = [];
  }

  getTotalPrice(): number {
    return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getItemCount(): number {
    return this._items.length;
  }

  hasItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}