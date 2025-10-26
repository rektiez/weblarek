import { IProduct } from '../../types';

export class Catalog {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  // Установить весь список товаров
  setProducts(products: IProduct[]): void {
    this._products = products;
  }

  // Получить все товары
  getProducts(): IProduct[] {
    return this._products;
  }

  // Найти товар по ID
  getProductById(id: string): IProduct | undefined {
    return this._products.find((p) => p.id === id);
  }

  // Установить выбранный товар
  setSelectedProduct(product: IProduct | null): void {
    this._selectedProduct = product;
  }

  // Получить выбранный товар
  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}