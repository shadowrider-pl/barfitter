import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface ICashup {
  id?: number;
  barmanLoginTime?: Moment;
  cashupTime?: Moment;
  startCash?: number;
  endCash?: number;
  totalSale?: number;
  cashTakenByManager?: number;
  cashTakenByBoss?: number;
  comment?: string;
  cashupUser?: IUser;
  openingUser?: IUser;
  restaurant?: IRestaurant;
}

export class Cashup implements ICashup {
  constructor(
    public id?: number,
    public barmanLoginTime?: Moment,
    public cashupTime?: Moment,
    public startCash?: number,
    public endCash?: number,
    public totalSale?: number,
    public cashTakenByManager?: number,
    public cashTakenByBoss?: number,
    public comment?: string,
    public cashupUser?: IUser,
    public openingUser?: IUser,
    public restaurant?: IRestaurant
  ) {}
}
