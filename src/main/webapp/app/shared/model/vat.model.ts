import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IVat {
  id?: number;
  description?: string;
  rate?: number;
  active?: boolean;
  restaurant?: IRestaurant;
}

export class Vat implements IVat {
  constructor(
    public id?: number,
    public description?: string,
    public rate?: number,
    public active?: boolean,
    public restaurant?: IRestaurant
  ) {
    this.active = this.active || false;
  }
}
