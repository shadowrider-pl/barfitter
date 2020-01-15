import { IRestaurant } from 'app/shared/model/restaurant.model';
import { IUser } from 'app/core/user/user.model';

export interface IUserToRestaurant {
  id?: number;
  restaurant?: IRestaurant;
  user?: IUser;
}

export class UserToRestaurant implements IUserToRestaurant {
  constructor(public id?: number, public restaurant?: IRestaurant, public user?: IUser) {}
}
