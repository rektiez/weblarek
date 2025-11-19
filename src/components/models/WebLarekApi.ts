import { IProduct, IOrderRequest, IOrderResponse } from '../../types';
import { Api } from '../base/Api';
export class ApiService extends Api {
    constructor(baseUrl: string, options: RequestInit = {}) {
      super(baseUrl, options); // инициализация конструктора родительского класса
  }

    async fetchProducts(): Promise<IProduct[]> {
        const response = await this.get<{ items: IProduct[] }>("/product");
        return response.items || []; // возвращаем массив товаров
    }

    async sendOrder(evt: IOrderRequest): Promise<IOrderResponse> {
        return await this.post<IOrderResponse>("/order/", evt);
    }
}