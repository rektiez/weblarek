import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Catalog {
  private products: IProduct[] = [];
  private selected: IProduct | null = null;

  constructor(private events: EventEmitter) {}

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed');
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setSelected(product: IProduct): void {
    this.selected = product;
    this.events.emit('catalog:selected', product);
  }

  getSelected(): IProduct | null {
    return this.selected;
  }
}