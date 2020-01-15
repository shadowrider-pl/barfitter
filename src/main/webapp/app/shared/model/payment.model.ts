import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IPayment {
  id?: number;
  description?: string;
  active?: boolean;
  restaurant?: IRestaurant;
}

export class Payment implements IPayment {
  constructor(public id?: number, public description?: string, public active?: boolean, public restaurant?: IRestaurant) {
    this.active = this.active || false;
  }
}
