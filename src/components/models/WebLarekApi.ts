import { IProduct, IOrderRequest, IOrderResponse } from "../../types";
import { Api } from "../base/Api";

export class WebLarekApi extends Api {
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options); 
  }

  async getProducts(): Promise<IProduct[]> {
    const response = await this.get<{ items: IProduct[] }>("/product");
    return response.items || []; 
  }

  async sendOrder(evt: IOrderRequest): Promise<IOrderResponse> {
    return await this.post<IOrderResponse>("/order/", evt);
  }
}
