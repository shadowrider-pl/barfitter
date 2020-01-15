import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IDesk {
  id?: number;
  description?: string;
  active?: boolean;
  parentId?: number;
  restaurant?: IRestaurant;
}

export class Desk implements IDesk {
  constructor(
    public id?: number,
    public description?: string,
    public active?: boolean,
    public parentId?: number,
    public restaurant?: IRestaurant
  ) {
    this.active = this.active || false;
  }
}
