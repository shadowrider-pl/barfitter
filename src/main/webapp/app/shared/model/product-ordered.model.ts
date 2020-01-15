import { Moment } from 'moment';
import { IOrderOpened } from 'app/shared/model/order-opened.model';
import { IOrderedProductStatus } from 'app/shared/model/ordered-product-status.model';
import { IVat } from 'app/shared/model/vat.model';
import { IProduct } from 'app/shared/model/product.model';
import { IUser } from 'app/core/user/user.model';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IProductOrdered {
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
  orderPosition?: number;
  sendTime?: Moment;
  order?: IOrderOpened;
  orderedProductStatus?: IOrderedProductStatus;
  productOrderedPurchPriceRate?: IVat;
  productOrderedSellPriceRate?: IVat;
  product?: IProduct;
  chef?: IUser;
  restaurant?: IRestaurant;
}

export class ProductOrdered implements IProductOrdered {
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
    public orderPosition?: number,
    public sendTime?: Moment,
    public order?: IOrderOpened,
    public orderedProductStatus?: IOrderedProductStatus,
    public productOrderedPurchPriceRate?: IVat,
    public productOrderedSellPriceRate?: IVat,
    public product?: IProduct,
    public chef?: IUser,
    public restaurant?: IRestaurant
  ) {}
}
