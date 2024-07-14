import { ICardActions, IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Card<T> extends Component<IProduct> {
	protected events: IEvents;

	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _id: string;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		protected container: HTMLElement,
		events: IEvents,
		actions?: ICardActions
	) {
		super(container);
		this.events = events;

		this._title = this.container.querySelector(`.${blockName}__title`);
		this._price = this.container.querySelector(`.${blockName}__price`);
		this._image = this.container.querySelector(`.${blockName}__image`);
		this._description = this.container.querySelector(`.${blockName}__text`);
		this._button = this.container.querySelector(`.${blockName}__button`);
		this._category = this.container.querySelector(`.${blockName}__category`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number | null) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
			this.setText(this._button, 'Такое не купишь!');
		}
	}

	get price(): number {
		return Number(this._price.textContent.match(/\d+/)[0]) || null;
	}

	set category(value: string) {
		this.setText(this._category, value);
		if (this._category) {
			switch (value) {
				case 'софт-скил':
					this.toggleClass(this._category, 'card__category_soft');
					break;
				case 'хард-скил':
					this.toggleClass(this._category, 'card__category_hard');
					break;
				case 'дополнительное':
					this.toggleClass(this._category, 'card__category_additional');
					break;
				case 'кнопка':
					this.toggleClass(this._category, 'card__category_button');
					break;
				case 'другое':
					this.toggleClass(this._category, 'card__category_other');
					break;
				default:
					this.toggleClass(this._category, 'card__category_other');
			}
		}
	}

	get category(): string {
		return this._category.textContent;
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	get description(): string {
		return this._description.textContent;
	}
}
