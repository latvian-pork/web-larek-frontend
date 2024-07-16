import { ApiPostMethods } from '../components/base/api';

// Типы данных, получаемых с сервера

export interface IProduct {
	isInBasket?: boolean;
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	index: number;
}

export interface IProductList {
	total: number | null;
	items: IProduct[];
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number | null;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number | null;
}

// Переиспользование типов для отображения компонентов

export type TAddressForm = Pick<IOrder, 'payment' | 'address'>;

export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;

export type TBuyerInfo = TAddressForm & TContactsForm;

export type TFormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейсы моделей данных

export interface IBuyerData {
	setBuyerInfo(buyerData: IOrder): void;
	validateAddressForm(): boolean;
	validateContactsForm(): boolean;
}

export interface IAppState {
	catalog: ICard[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IModalData {
	content: HTMLElement;
}

// Типизация действий

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccessActions {
	onClick: () => void;
}

// Компоненты

export interface ISuccess {
	total: number;
}

export interface ICard {
	title: string;
	description?: string;
	image?: string;
	category?: string;
	price: number | null;
}

export interface IPage {
	counter: number;
	basketButton: HTMLButtonElement;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

// API

export interface IApi {
	baseUrl: string;
	get<T>(url: string): Promise<T>;
	post<T>(url: string, data: object, method?: ApiPostMethods): Promise<T>;
}
