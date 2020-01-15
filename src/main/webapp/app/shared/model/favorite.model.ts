import { IProduct } from 'app/shared/model/product.model';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IFavorite {
  id?: number;
  product?: IProduct;
  restaurant?: IRestaurant;
}

export class Favorite implements IFavorite {
  constructor(public id?: number, public product?: IProduct, public restaurant?: IRestaurant) {}
}
