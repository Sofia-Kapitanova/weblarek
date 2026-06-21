import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketData {
  protected _items: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  add(product: IProduct): void {
    // Проверяем, чтобы товар не дублировался в корзине
    if (!this.checkItem(product.id)) {
      this._items.push(product);
      this.events.emit("basket:changed", { items: this._items });
    }
  }

  remove(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
    this.events.emit("basket:changed", { items: this._items });
  }

  clear(): void {
    this._items = [];
    this.events.emit("basket:changed", { items: this._items });
  }

  getTotalPrice(): number {
    return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCounter(): number {
    return this._items.length;
  }

  checkItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}
