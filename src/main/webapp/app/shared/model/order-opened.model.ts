import { Moment } from 'moment';
import { IPayment } from 'app/shared/model/payment.model';
import { IDesk } from 'app/shared/model/desk.model';
import { IUser } from 'app/core/user/user.model';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IOrderOpened {
  id?: number;
  total?: number;
  comment?: string;
  openingTime?: Moment;
  closingTime?: Moment;
  orderId?: number;
  payment?: IPayment;
  desk?: IDesk;
  barman?: IUser;
  restaurant?: IRestaurant;
}

export class OrderOpened implements IOrderOpened {
  constructor(
    public id?: number,
    public total?: number,
    public comment?: string,
    public openingTime?: Moment,
    public closingTime?: Moment,
    public orderId?: number,
    public payment?: IPayment,
    public desk?: IDesk,
    public barman?: IUser,
    public restaurant?: IRestaurant
  ) {}
}
