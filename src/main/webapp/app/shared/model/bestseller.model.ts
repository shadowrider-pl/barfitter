import { IProduct } from 'app/shared/model/product.model';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IBestseller {
  id?: number;
  product?: IProduct;
  restaurant?: IRestaurant;
}

export class Bestseller implements IBestseller {
  constructor(public id?: number, public product?: IProduct, public restaurant?: IRestaurant) {}
}
