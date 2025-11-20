import { IProduct } from '../../types';

export class Catalog {
  private _products: IProduct[] = [];
  private _selected: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this._products = products;
  }

  getProducts(): IProduct[] {
    return [...this._products];
  }

  setSelected(product: IProduct): void {
    this._selected = product;
  }

  getSelected(): IProduct | null {
    return this._selected;
  }

  getProductById(id: string): IProduct | undefined {
    return this._products.find(p => p.id === id);
  }
}