import { Api } from "../base/Api";
import { IProduct, IOrder, IOrderResult, IApiListResponse } from "../../types";

export class LarekApi extends Api {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // Получение списка товаров с сервера (GET запрос на /product)
  getProductsList(): Promise<IProduct[]> {
    return this.get<IApiListResponse<IProduct>>("/product").then((data) =>
      data.items.map((item) => ({
        ...item,
        // Склеиваем префикс CDN и относительный путь к картинке
        image: this.cdn + item.image,
      })),
    );
  }

  // Отправка данных заказа на сервер (POST запрос на /order)
  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>("/order", order);
  }
}
