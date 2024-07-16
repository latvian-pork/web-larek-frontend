import { AppApi } from './components/AppApi';
import { AppState, CardItem } from './components/AppData';
import { Card } from './components/Card';
import { AddressForm, ContactsForm } from './components/Order';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Form } from './components/common/Form';
import { Modal } from './components/common/Modal';
import { Success } from './components/Success';
import './scss/styles.scss';
import { IBuyerData, TAddressForm, TBuyerInfo, TContactsForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { ApiListResponse } from './components/base/api';
import { Basket } from './components/Basket';

const events = new EventEmitter();
const appData = new AppState({ basket: [] }, events);
const api = new AppApi(CDN_URL, API_URL);
const page = new Page(ensureElement<HTMLElement>('.page'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new AddressForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

// Для отладки
// events.onAll((evt) => {
// 	console.log(evt.eventName, evt.data);
// });

const modal = new Modal(document.querySelector('#modal-container'), events);

// Запросили данные с сервера
api
	.getProducts()
	.then((res) => {
		appData.catalog = res;
		events.emit('initialData:loaded');
	})
	.catch((err) => {
		console.error(err);
	});

// Загрузились данные, можно рисовать
events.on('initialData:loaded', () => {
	const catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), events, {
			onClick: () => {
				events.emit('card:select', item);
			},
		});
		return card.render(item);
	});
	page.render({
		counter: appData.order.items.length,
		catalog: catalog,
		locked: false,
	});
});

// Выбранная карточка отправляется в превью
events.on('card:select', (item: CardItem) => {
	appData.setPreview(item);
});

// Отрисовываем превью
events.on('preview:changed', (item: CardItem) => {
	const showItem = (item: CardItem) => {
		const card = new Card('card', cloneTemplate(cardPreviewTemplate), events, {
			onClick: () => {
				events.emit('basket:changed', item);
				appData.addToBasket(item.id);
				modal.close();
				page.counter = appData.basket.length;
			},
		});
		card.button = appData.basket.includes(item.id);
		modal.render({
			content: card.render(item),
		});
	};
	if (item) {
		api
			.getProduct(item.id)
			.then((res) => {
				item.description = res.description;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	}
});

// Блокируем страницу при открытии модалки
events.on('modal:open', () => {
	page.locked = true;
});

// ...И разблокируем при закрытии
events.on('modal:close', () => {
	page.locked = false;
});

// Отрисовываем модалку с формой с адресом
events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			valid: false,
			errors: [],
			address: '',
		}),
	});
});

// Отображение ошибок валидации формы с адресом
events.on('addressErrors:change', (errors: Partial<TBuyerInfo>) => {
	const { address, payment } = errors;
	orderForm.valid = !payment && !address;
	orderForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Отрабатываем изменения в полях форм

// Изменение полей доставки
events.on(
	/^order\..*:change/,
	(data: { field: keyof TAddressForm; value: string }) => {
			appData.setOrderField(data.field, data.value);
	}
);

// Изменение полей контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof TContactsForm; value: string }) => {
			appData.setOrderField(data.field, data.value);
	}
);

// Отрисовываем вторую форму с заказом
events.on('contacts:open', () => {
	modal.render({
		content: contactsForm.render({
			valid: false,
			errors: [],
			email: '',
			phone: '',
		}),
	});
});

// Отображение ошибок валидации формы с почтой
events.on('contactsErrors:change', (errors: Partial<TBuyerInfo>) => {
	const { email, phone } = errors;
	contactsForm.valid = !email && !phone;
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Отправляем сформированный заказ на сервер
events.on('order:send', () => {
	appData.order.total = appData.getBasketTotal();
	appData.order.items = appData.basket;

	api
		.post('/order', appData.order)
		.then((res: ApiListResponse<string>) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
						appData.clearBasket();
						appData.order = {
							items: [],
							total: null,
							address: '',
							email: '',
							phone: '',
							payment: '',
						};
						page.counter = 0;
				},
			});
			modal.render({
				content: success.render({
                    total: res.total
                })
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Рисуем корзину при открытии
events.on('basket:open', () => {
	modal.render({
		content: basket.render({
			items: appData.basket.map((item) => {
				const card = new Card(
					'card',
					cloneTemplate(cardBasketTemplate),
					events,
					{
						onClick: () => {
							appData.removeFromBasket(item);
							page.counter = appData.basket.length || 0;
							events.emit('basket:changed');
						},
					}
				);
				card.index = appData.basket.indexOf(item) + 1;
				return card.render(appData.getProduct(item));
			}),
			total: appData.getBasketTotal() || 0,
		}),
	});
});

// Ещё раз перерисовываем корзину при изменении наполнения
events.on('basket:changed', () => {
	basket.render({
		items: appData.basket.map((item) => {
			const card = new Card('card', cloneTemplate(cardBasketTemplate), events, {
				onClick: () => {
					appData.removeFromBasket(item);
					page.counter = appData.basket.length || 0;
					events.emit('basket:changed');
				},
			});
			return card.render(appData.getProduct(item));
		}),
		total: appData.getBasketTotal() || 0,
	});
});
