import { ICategory } from 'app/shared/model/category.model';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IXsell {
  id?: number;
  fromCategory?: ICategory;
  toCategory?: ICategory;
  restaurant?: IRestaurant;
}

export class Xsell implements IXsell {
  constructor(public id?: number, public fromCategory?: ICategory, public toCategory?: ICategory, public restaurant?: IRestaurant) {}
}
