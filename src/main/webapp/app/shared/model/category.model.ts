import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface ICategory {
  id?: number;
  name?: string;
  parentId?: number;
  active?: boolean;
  restaurant?: IRestaurant;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public name?: string,
    public parentId?: number,
    public active?: boolean,
    public restaurant?: IRestaurant
  ) {
    this.active = this.active || false;
  }
}
