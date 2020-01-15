import { User } from 'app/core/user/user.model';
import { Restaurant } from '../../shared/model/restaurant.model';
export class RestaurantRegistration {
  constructor(public restaurant: Restaurant, public user: User) {}
}
