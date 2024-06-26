# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка продукта

```
export interface IProductItem {
  _id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

Список карточек продуктов (каталог)

```
export interface IProductList {
  total: number | null;
  items: IProductItem[];
  preview: string | null;
}
```

Корзина

```
export interface IBasket {
  payment: string;
  email: string;
  phone: string;
  address: string;
  totalPrice: number | null;
  items: IProductItem['_id'][];
}
```

Типы для отображения каталога

```
export type TProductList = Pick<IProductList, 'items'>;
```

Тип данных о товаре в каталоге

```
export type TProductListItem = Pick<IProductItem, 'title' | 'category' | 'image' | 'price'>;
```

Тип данных о товаре, отображаемых в модальном окне

```
export type TProductInfo = Pick<IProductItem, 'title' | 'category' | 'image' | 'price' | 'description'>;
```

Тип данных для отображения содержимого корзины

```
export type TBasket = Pick<IBasket, 'items' | 'totalPrice'>;
```

Тип данных для отображения товара в корзине

```
export type TBasketItem = Pick<IProduct, 'title' | 'price'>
```

Тип данных покупателя

```
export type TBuyerInfo = Pick<IBasket, 'payment' | 'address' | 'email' | 'phone'>;
```

Данные для модального окна успешного заказа

```
export type TSuccess = Pick<IBasket, 'totalPrice'>;
```


## Архитектура приложения

Код приложения разделён на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице;
- слой данных, отвечает за хранение и изменение данных;
- презентер, отвечает за связь представления в данных.

## Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передаётся базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET-запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправлет эти данные на ендпоинт, переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть определён заданием третьего параметра при вызове (методы хранятся в типе `ApiPostMethods`).

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом, описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

### Слой данных

#### Класс ProductListData 
Класс отвечает за хранение и логику работы с данными карточек товаров.\
В полях класса хранятся следующие данные:
- _total: number | null - общее количество карточек в массиве;
- _items: IProduct[] - массив объектов товаров;
- _preview: string | null - id карточки товара, выбранной для просмотра в модальном окне;

Также класс предоставляет набор методов для взаимодействия с данными. 
-   getCard(cardId: string): IProduct - возвращает карточку товара по её id;
А также сеттеры и геттеры для сохранения и получения данных из полей класса.

#### Класс BasketData 
Класс отвечает за хранение и логику работы с данными корзины.\
В полях класса хранятся следующие данные:
- _payment: string - способ оплаты;
- _email: string - почта;
- _phone: string - номер телефона;
- _address: string - адрес доставки;
- _totalPrice: number | null - итоговая стоимость товаров в корзине;
- _items: IProduct['_id'][] - массив id карточек товаров;
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Также класс предоставляет набор методов для взаимодействия с данными. 
- getBuyerInfo(): TBuyerInfo - метод для получения данных о покупателе;
- setBuyerInfo(buyerData: TBuyerInfo): void - сохраняет данные о покупателе;
- checkValidation(data: Record<keyof TBuyerInfo, string>): boolean - проверяет объект с данными покупателя на валидность;
А также сеттеры и геттеры для сохранения и получения данных из полей класса.

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа. 
- constructor(selector: string, contentSelector: string events: IEvents) - конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно, селектор шаблона, содержимое которого будет в него помещено, и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- modal: HTMLElement - элемент модального окна
- content: HTMLElement - шаблон содержимого модального окна
- events: IEvents - брокер событий

#### Класс ModalWithForm
Расширяет класс Modal. Предназначен для реализации модального окна с формой, содержащей поля ввода. При сабмите инициирует событие, передавая в него объект с данными из полей ввода формы. При изменении данныз в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения. \
Поля класса:
- submitButton: HTMLButtonElement - кнопка подтверждения;
- _form: HTMLFormElement - элемент формы;
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы;
- errors: Record<string, HTMLElement> - объект, хранящий все элементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов.

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения;
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, а значение - данные, введённые пользователем;
- setInputValues(): Record<string, string> - принимает объект с данными для заполнения полей;
- setError(data: {field: string, value: string, validInformation: string}): void - принимает объект с данными для отображения или сокрытия текстов ошибок под полями ввода;
- showInputError(field: string, errorMessage: string): void - отображает полученный текст ошибки под указанным полем ввода;
- hideInputError(field: string): void - очищает текст ошибки под указанным полем ввода;
- close(): void - расширяет родительский метод, дополнительно при закрытии очищая поля формы и деактивируя кнопку сохранения;
- get form: HTMLElement - геттер для получения элемента формы.

#### Класс ModalWithProduct
Расширяет класс Modal. Предназначен для реализации модального окна с данными о товаре. При открытии модального окна получает данные товара, который нужно отобразить. \
Поля класса:
- _title: HTMLElement - название товара;
- _category: HTMLElement - категория товара;
- _description: HTMLElement - описание товара;
- _button: HTMLButtonElement - кнопка "в корзину";
- _price: HTMLElement - цена товара;
- _image: HTMLImageElement - иконка;

Методы:
- open(data: {title: string, category: string, description: string, price: number, image: string}): void - расширение родительского метода, принимает данные товара, которые используются для заполнения атрибутов элементов модального окна;
- close(): void - расширяет родительский метод, выполняя дополнительно очистку атрибутов модального окна.

#### Класс ModalWithBasket
Расширяет класс Modal. Предназначен для реализации модального окна с корзиной. При открытии модального окна получает данные содержимого корзины и отображает информацию о товарах. \
Поля класса:
- _basket: HTMLElement - элемент корзины;
- _list: TBasketItem[] - нумерованный список товаров в корзине;
- _index: number - номер товара в списке;
- _total: number - итоговая сумма покупки;
- _button: HTMLButtonElement - кнопка "оформить";
- _deleteButton: HTMLButtonElement - кнопка удаления товара из корзины. \

Класс предоставляет метод `addCard(cardElement: HTMLElement)` для добавления карточки товара в корзину и `disableButton(button: _button, container: _list)`, который изменяет активность кнопки оформления заказа, если корзина пуста.

#### Класс ModalWithSuccess
Расширяет класс Modal. Предназначен для реализации модального окна с уведомлением об успешном оформлении заказа. При открытии модального окна с помощью геттера получает данные об итоговой сумме покупки и отображает их.

### Класс Card
Отвечает за отображение карточки, задавая в карточке данные названия, категории, изображения, описания и стоимости товара. Класс используется для отображения карточек на странице сайта. В конструктора класса передаётся DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов вёрстки. В классе устанавливается слушатель, в результате взаимодействия с которым пользователем открывается модальное окно с подробной информацией о товаре. \
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта, принимает экземпляр `EventEmitter` для инициации событий. \
Методы:
- setData(cardData: IProduct): void - заполняет атрибуты элементов карточки данными;
- render(): HTMLElement - метод возвращает полностью заполненную карточку с установленными слушателями;
- геттер id возвращает уникальный id товара.

#### Класс CardContainer
Отвечает за отображение каталога товаров на главной странице. Предоставляет метод `addCard(cardElement: HTMLElement)` для добавления карточек на страницу и сеттер `container` для полного обновления содержимого. В конструктор принимает контейнер, в котором размещаются карточки. 

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы, реализующие взаимодействие с бэкендом сервиса. 

## Взаимодействие компонентов
Код, описывающий взаимодействие предоставления и данных между собой, находится в файле `index.ts`, выполняющем роль презентера. \
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `cards: changed` - изменение массива карточек;
- `card: selected` - изменение открываемой в модальном окне карточки;
- `basket: changed` - изменение наполнения корзины;
-  `buyer: changed` - изменение данных о покупателе при оформлении заказа.

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `product:open` - открытие модального окна товара
- `basket:open` - открытие модального окна корзины
- `address:open` - открытие модального окна с формой адреса
- `buyer: open` - открытие модального окна с формами контактов покупателя
- `success: open` - открытие модального окна уведомления об успешном оформлении заказа
- `card:select` - выбор карточки для отображения в модальном окне
- `basket:change` - добавление и удаление товара в корзине
- `payment:select` - выбор способа оплаты при оформлении
- `address:input` - изменение данных в форме адреса
- `address:submit` - отправка формы со способом оплаты и адресом
- `email:input` - изменение данных в форме почты
- `phone:input` - изменение данных в форме номера телефона
- `buyer:submit` - отправка формы с почтой и номером телефона покупателя
- `address:validation` - валидация формы с адресом
- `buyer:validation` - валидация формы с контактами покупателя
- `card:previewClear` - очистка данных выбранной для показа в модальном окне карточки