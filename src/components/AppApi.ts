import {
	IApi,
	IBuyerData,
	IOrder,
	IOrderResult,
	IProduct,
	IProductList,
} from '../types';
import { Api, ApiListResponse } from './base/api';

export class AppApi extends Api implements IApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	setBuyer(data: IOrder): Promise<IOrder> {
		return this.post<IOrder>(`/order`, data, 'POST').then((res: IOrder) => res);
	}
}
