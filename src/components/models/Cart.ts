import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Cart extends EventEmitter {
  private _items: IProduct[] = [];

  // ✅ Добавьте конструктор
  constructor(protected events: EventEmitter) {
    super();
  }

  // ... остальные методы без изменений ...
  get items(): IProduct[] { return [...this._items]; }
  get count(): number { return this._items.length; }
  get total(): number {
    return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  hasItem(id: string): boolean {
    return this._items.some(item => item.id === id);
  }

  addItem(product: IProduct) {
    if (!this.hasItem(product.id)) {
      this._items.push(product);
      this.emit('basket:changed');
    }
  }

  removeItem(id: string) {
    const index = this._items.findIndex(item => item.id === id);
    if (index !== -1) {
      this._items.splice(index, 1);
      this.emit('basket:changed');
    }
  }

  clear() {
    this._items = [];
    this.emit('basket:changed');
  }
}