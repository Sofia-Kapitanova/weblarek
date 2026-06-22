export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

// Тип для платежной системы
export type TPayment = "card" | "cash";

// Тип для хранения ошибок валидации формы данных покупателя
export type TFormErrors = Partial<Record<keyof IBuyer, string>>;

// Интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс покупателя
export interface IBuyer {
  payment: TPayment | "";
  email: string;
  phone: string;
  address: string;
}

// Структура заказа для отправки на сервер (Объединяет данные покупателя, товары и сумму)
export interface IOrder extends IBuyer {
  items: string[]; // Массив ID купленных товаров
  total: number; // Итоговая стоимость заказа
}

// Ответ от сервера при успешном оформлении заказа
export interface IOrderResult {
  id: string; // Уникальный ID созданного заказа
  total: number; // Подтвержденная сумма покупки
}

// Вспомогательный тип ответа сервера при запросе списка товаров
export interface IApiListResponse<Type> {
  total: number;
  items: Type[];
}
