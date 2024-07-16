import { IPage, IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _basketButton: HTMLButtonElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.events = events;
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._basketButton = ensureElement<HTMLButtonElement>('.header__basket');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._basketButton.addEventListener('click', () =>
			this.events.emit('basket:open')
		);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this.toggleClass(this._wrapper, 'page__wrapper_locked', true);
		} else {
			this.toggleClass(this._wrapper, 'page__wrapper_locked', false);
		}
	}
}
