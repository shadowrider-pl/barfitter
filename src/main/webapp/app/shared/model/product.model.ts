import { IVat } from 'app/shared/model/vat.model';
import { IProductType } from 'app/shared/model/product-type.model';
import { ICategory } from 'app/shared/model/category.model';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IProduct {
  id?: number;
  name?: string;
  purchPriceNet?: number;
  sellPriceGross?: number;
  active?: boolean;
  purchPriceGross?: number;
  purchVatValue?: number;
  sellPriceNet?: number;
  sellVatValue?: number;
  productSellPriceRate?: IVat;
  productPurchPriceRate?: IVat;
  productType?: IProductType;
  category?: ICategory;
  restaurant?: IRestaurant;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public name?: string,
    public purchPriceNet?: number,
    public sellPriceGross?: number,
    public active?: boolean,
    public purchPriceGross?: number,
    public purchVatValue?: number,
    public sellPriceNet?: number,
    public sellVatValue?: number,
    public productSellPriceRate?: IVat,
    public productPurchPriceRate?: IVat,
    public productType?: IProductType,
    public category?: ICategory,
    public restaurant?: IRestaurant
  ) {
    this.active = this.active || false;
  }
}
