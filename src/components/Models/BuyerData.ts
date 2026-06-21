import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerData {
  protected _buyer: IBuyer = {
    payment: "card", // значение по умолчанию
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

    // После каждого изменения запускаем валидацию и сообщаем приложению об ошибках
    const errors = this.validate();
    this.events.emit("buyerForm:errors", errors);
  }

  getBuyerData(): IBuyer {
    return this._buyer;
  }

  clear(): void {
    this._buyer = {
      payment: "card",
      address: "",
      email: "",
      phone: "",
    };
  }

  validate(): Record<keyof IBuyer, string> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._buyer.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this._buyer.address || this._buyer.address.trim() === "") {
      errors.address = "Укажите адрес доставки";
    }
    if (!this._buyer.email || this._buyer.email.trim() === "") {
      errors.email = "Укажите email";
    }
    if (!this._buyer.phone || this._buyer.phone.trim() === "") {
      errors.phone = "Укажите номер телефона";
    }

    return errors as Record<keyof IBuyer, string>;
  }
}
