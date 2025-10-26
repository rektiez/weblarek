import { IApi, IProduct, IOrderRequest, IOrderResponse } from '../../types/index.ts';

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

   async fetchProductsList(): Promise<IProduct[]> {
    const response = await this.api.get<{ items: IProduct[] }>('/product/');
    return response.items;
  }

   async submitOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }

}