import {
	IAppState,
	ICard,
	IOrder,
	IProduct,
	TBuyerInfo,
	TFormErrors,
} from '../types';
import { cloneTemplate } from '../utils/utils';
import { Model } from './base/Model';

export class CardItem extends Model<ICard> {
	description: string;
	id: string;
	image: string;
	title: string;
	category: string;
	price: number;
	index: number;
}

export class AppState extends Model<IAppState> {
	basket: string[];
	catalog: IProduct[];
	order: IOrder = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		total: null,
		items: [],
	};
	preview: string | null;
	formErrors: TFormErrors = {};

	toggleOrderedProduct(id: string, isIncluded: boolean) {
		if (isIncluded) {
			this.order.items = Array.from(new Set([...this.order.items, id]));
		} else {
			this.order.items = [...this.order.items, id];
		}
	}

	addToBasket(id: string) {
		if (this.basket) {
			if (this.basket.includes(id)) {
				this.basket = Array.from(new Set([...this.basket, id]));
			} else {
				this.basket = [...this.basket, id];
			}
		} else {
			this.basket = [id];
		}
	}

	removeFromBasket(id: string) {
		if (this.basket) {
			this.basket = this.basket.filter((item) => item !== id);
		} else return;
	}

	getProduct(productId: string) {
		const foundProduct = this.catalog.find((item) => item.id === productId);
		if (foundProduct) {
			return foundProduct;
		} else {
			console.error('Товар не найден');
		}
	}

	clearBasket() {
		this.order.items.forEach((id) => {
			this.removeFromBasket(id);
		});
	}

	getBasketTotal() {
		return this.basket.reduce(
			(acc, value) =>
				acc + this.catalog.find((item) => item.id === value).price,
			0
		);
	}

	setCatalog(items: ICard[]) {
		this.catalog = items.map((item) => new CardItem(item, this.events));
	}

	setPreview(item: CardItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(field: keyof TBuyerInfo, value: string) {
		this.order[field] = value;
		if (this.validateAddressForm()) {
		}
		if (this.validateContactsForm()) {
		}
		if (this.validateOrder()) {
		}
	}

	validateOrder() {
		return this.validateAddressForm() && this.validateContactsForm();
	}

	validateAddressForm(): boolean {
		const errors: typeof this.formErrors = {};
		if (this.order.payment.length === 0) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (this.order.address.length === 0) {
			errors.address = 'Укажите адрес доставки';
		}
		this.formErrors = errors;
		this.events.emit('addressErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactsForm(): boolean {
		const errors: typeof this.formErrors = {};
		const emailRegex = /([a-aA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
		if (!emailRegex.test(this.order.email)) {
			errors.email = 'Укажите почту';
		}
		const phoneRegex = /(\+7|8)[- _]*\(?[- _]*(\d{3}[- _]*\)?([- _]*\d){7}|\d\d[- _]*\d\d[- _]*\)?([- _]*\d){6})/g;
		if (!phoneRegex.test(this.order.phone)) {
			errors.phone = 'Укажите номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('contactsErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
