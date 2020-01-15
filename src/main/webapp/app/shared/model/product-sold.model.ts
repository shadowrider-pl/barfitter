import { Moment } from 'moment';
import { IProduct } from 'app/shared/model/product.model';
import { IOrderClosed } from 'app/shared/model/order-closed.model';
import { IVat } from 'app/shared/model/vat.model';
import { IUser } from 'app/core/user/user.model';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IProductSold {
  id?: number;
  orderedTime?: Moment;
  acceptedTime?: Moment;
  finishedTime?: Moment;
  takenTime?: Moment;
  quantity?: number;
  comment?: string;
  purchPriceNet?: number;
  purchPriceGross?: number;
  purchVatValue?: number;
  sellPriceNet?: number;
  sellPriceGross?: number;
  sellVatValue?: number;
  difference?: number;
  deliveryDate?: Moment;
  sendTime?: Moment;
  product?: IProduct;
  order?: IOrderClosed;
  productSoldPurchPriceRate?: IVat;
  productSoldSellPriceRate?: IVat;
  chef?: IUser;
  restaurant?: IRestaurant;
}

export class ProductSold implements IProductSold {
  constructor(
    public id?: number,
    public orderedTime?: Moment,
    public acceptedTime?: Moment,
    public finishedTime?: Moment,
    public takenTime?: Moment,
    public quantity?: number,
    public comment?: string,
    public purchPriceNet?: number,
    public purchPriceGross?: number,
    public purchVatValue?: number,
    public sellPriceNet?: number,
    public sellPriceGross?: number,
    public sellVatValue?: number,
    public difference?: number,
    public deliveryDate?: Moment,
    public sendTime?: Moment,
    public product?: IProduct,
    public order?: IOrderClosed,
    public productSoldPurchPriceRate?: IVat,
    public productSoldSellPriceRate?: IVat,
    public chef?: IUser,
    public restaurant?: IRestaurant
  ) {}
}
