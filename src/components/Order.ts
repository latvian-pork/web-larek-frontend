import {
	IAppState,
	IBuyerData,
	IOrder,
	IProduct,
	TAddressForm,
	TBuyerInfo,
	TContactsForm,
	TFormErrors,
} from '../types';
import { Model } from './base/Model';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class AddressForm extends Form<TAddressForm> {
	protected _payment: string | null;
	protected _cashButton?: HTMLButtonElement;
	protected _cardButton?: HTMLButtonElement;
	protected _button: HTMLButtonElement;
	protected _address?: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._cashButton = container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;
		this._cardButton = container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._cashButton.addEventListener('click', () => {
			this.onInputChange('payment', 'cash');
		});
		this._cardButton.addEventListener('click', () => {
			this.onInputChange('payment', 'card');
		});
		this._button = container.querySelector('.order__button');
		this._button.addEventListener('click', () => {
			events.emit('contacts:open');
		});
	}

	set payment(value: string) {
		if ((value = 'card')) {
			this._cardButton.classList.add('button_alt-active');
			this._cashButton.classList.remove('button_alt-active');
		}
		if ((value = 'cash')) {
			this._cardButton.classList.remove('button_alt-active');
			this._cashButton.classList.add('button_alt-active');
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

export class ContactsForm extends Form<TContactsForm> {
	protected _button: HTMLButtonElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._button = container.querySelector('.button');
		this._button.addEventListener('click', () => {
			events.emit('order:send');
		});
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
