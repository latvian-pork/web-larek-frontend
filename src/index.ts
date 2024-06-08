import './scss/styles.scss';

// Типы данных, получаемых с сервера

export interface IProduct {
  _id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IProductList {
  total: number | null;
  items: IProduct[];
  preview: string | null;
  getCard(cardId: string): IProduct;
}

export interface IBasket {
  payment: string;
  email: string;
  phone: string;
  address: string;
  totalPrice: number | null;
  items: IProduct['_id'][];
  getBuyerInfo(): TBuyerInfo;
  setBuyerInfo(buyerData: TBuyerInfo): void;
  checkValidation(data: Record<keyof TBuyerInfo, string>): boolean;
}

// Переиспользование типов для отображения компонентов

export type TProductList = Pick<IProductList, 'items'>;

export type TProductListItem = Pick<IProduct, 'title' | 'category' | 'image' | 'price'>;

export type TProductInfo = Pick<IProduct, 'title' | 'category' | 'image' | 'price' | 'description'>;

export type TBasket = Pick<IBasket, 'items' | 'totalPrice'>;

export type TBasketItem = Pick<IProduct, 'title' | 'price'>

export type TBuyerInfo = Pick<IBasket, 'payment' | 'address' | 'email' | 'phone'>;

export type TSuccess = Pick<IBasket, 'totalPrice'>;







