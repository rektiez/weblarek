import { IProduct } from '../../types';

export class Catalog {
  // Массив всех товаров
  private _products: IProduct[] = [];

  // Товар, выбранный для подробного отображения
  private _selectedProduct: IProduct | null = null;

  // Сохранение массива товаров
  setProductsList(products: IProduct[]): void {
    this._products = products;
  }

  // Получение списка всех товаров
  getProducts(): IProduct[] {
    return this._products;
  }

  // Получение одного товара по ID
  getProductById(id: string): IProduct | undefined {
    return this._products.find((product) => product.id === id);
  }

  // Сохранение товара для подробного отображения
  setSelectedProduct(product: IProduct): void {
    this._selectedProduct = product;
  }

  // Получение выбранного товара
  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}