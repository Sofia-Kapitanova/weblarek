import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductsData {
  protected _products: IProduct[] = [];
  protected _previewProduct: IProduct | null = null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setProducts(products: IProduct[]): void {
    this._products = products;
    // Генерируем событие, что товары в каталоге обновились
    this.events.emit("products:changed", { products: this._products });
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getProduct(id: string): IProduct | undefined {
    return this._products.find((product) => product.id === id);
  }

  setPreviewProduct(product: IProduct | null): void {
    this._previewProduct = product;
    // Генерируем событие, чтобы открыть модалку с деталями товара
    this.events.emit("preview:changed", { product });
  }

  getPreviewProduct(): IProduct | null {
    return this._previewProduct;
  }
}
