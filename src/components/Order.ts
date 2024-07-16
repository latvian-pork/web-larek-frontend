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
		this._button = this._submit;
		this.container.addEventListener('submit', () => {
			events.emit('contacts:open');
		});
	}

	set payment(value: string) {
		if ((value = 'card')) {
			this.toggleCard();
			this.toggleCash(false);
		}
		if ((value = 'cash')) {
			this.toggleCard(false);
			this.toggleCash();
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	toggleCard(state: boolean = true) {
		this.toggleClass(this._cardButton, 'button_alt-active', state);
}

toggleCash(state: boolean = true) {
	this.toggleClass(this._cashButton, 'button_alt-active', state);
}

}

export class ContactsForm extends Form<TContactsForm> {
	protected _button: HTMLButtonElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._button = this._submit;
		this.container.addEventListener('submit', () => {
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
