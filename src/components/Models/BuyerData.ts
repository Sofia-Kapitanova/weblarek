import { IBuyer, TPayment, TFormErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerData {
  protected _buyer: IBuyer = {
    payment: "",
    address: "",
    email: "",
    phone: "",
  };
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setField(field: keyof IBuyer, value: string | TPayment): void {
    // Обновляем только одно конкретное поле, сохраняя остальные данные
    (this._buyer[field] as string | TPayment) = value;

    const currentData = this.getBuyerData();
    this.events.emit("buyerForm:change", currentData);
  }

  getBuyerData(): IBuyer {
    return this._buyer;
  }

  clear(): void {
    this._buyer = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };
  }

  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this._buyer.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this._buyer.address?.trim()) {
      errors.address = "Укажите адрес доставки";
    }
    if (!this._buyer.email?.trim()) {
      errors.email = "Укажите email";
    }
    if (!this._buyer.phone?.trim()) {
      errors.phone = "Укажите номер телефона";
    }

    return errors;
  }
}
