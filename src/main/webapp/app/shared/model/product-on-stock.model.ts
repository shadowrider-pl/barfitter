import { Moment } from 'moment';
import { IProduct } from 'app/shared/model/product.model';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IProductOnStock {
  id?: number;
  deliveryDate?: Moment;
  quantity?: number;
  purchPriceNet?: number;
  purchPriceGross?: number;
  purchVatValue?: number;
  sellPriceNet?: number;
  sellPriceGross?: number;
  sellVatValue?: number;
  product?: IProduct;
  restaurant?: IRestaurant;
}

export class ProductOnStock implements IProductOnStock {
  constructor(
    public id?: number,
    public deliveryDate?: Moment,
    public quantity?: number,
    public purchPriceNet?: number,
    public purchPriceGross?: number,
    public purchVatValue?: number,
    public sellPriceNet?: number,
    public sellPriceGross?: number,
    public sellVatValue?: number,
    public product?: IProduct,
    public restaurant?: IRestaurant
  ) {}
}
