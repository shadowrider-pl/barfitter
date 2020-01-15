import { Moment } from 'moment';
import { IProduct } from 'app/shared/model/product.model';
import { ICategory } from 'app/shared/model/category.model';
import { IVat } from 'app/shared/model/vat.model';
import { IProductType } from 'app/shared/model/product-type.model';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IProductDelivered {
  id?: number;
  name?: string;
  deliveryDate?: Moment;
  quantity?: number;
  purchPriceGross?: number;
  sellPriceGross?: number;
  purchPriceNet?: number;
  purchVatValue?: number;
  sellPriceNet?: number;
  sellVatValue?: number;
  product?: IProduct;
  category?: ICategory;
  productDeliveredPurchPriceRate?: IVat;
  productDeliveredSellPriceRate?: IVat;
  productType?: IProductType;
  restaurant?: IRestaurant;
}

export class ProductDelivered implements IProductDelivered {
  constructor(
    public id?: number,
    public name?: string,
    public deliveryDate?: Moment,
    public quantity?: number,
    public purchPriceGross?: number,
    public sellPriceGross?: number,
    public purchPriceNet?: number,
    public purchVatValue?: number,
    public sellPriceNet?: number,
    public sellVatValue?: number,
    public product?: IProduct,
    public category?: ICategory,
    public productDeliveredPurchPriceRate?: IVat,
    public productDeliveredSellPriceRate?: IVat,
    public productType?: IProductType,
    public restaurant?: IRestaurant
  ) {}
}
