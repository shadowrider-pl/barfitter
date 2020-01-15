import { Moment } from 'moment';
import { ICashup } from 'app/shared/model/cashup.model';
import { IDesk } from 'app/shared/model/desk.model';
import { IPayment } from 'app/shared/model/payment.model';
import { IUser } from 'app/core/user/user.model';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IOrderClosed {
  id?: number;
  openingTime?: Moment;
  closingTime?: Moment;
  total?: number;
  comment?: string;
  orderId?: number;
  cashupDay?: ICashup;
  desk?: IDesk;
  payment?: IPayment;
  barman?: IUser;
  restaurant?: IRestaurant;
}

export class OrderClosed implements IOrderClosed {
  constructor(
    public id?: number,
    public openingTime?: Moment,
    public closingTime?: Moment,
    public total?: number,
    public comment?: string,
    public orderId?: number,
    public cashupDay?: ICashup,
    public desk?: IDesk,
    public payment?: IPayment,
    public barman?: IUser,
    public restaurant?: IRestaurant
  ) {}
}
