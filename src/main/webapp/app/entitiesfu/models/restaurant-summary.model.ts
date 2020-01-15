import { Restaurant } from '../../shared/model/restaurant.model';
import { Moment } from 'moment';
export class RestaurantSummary {
  constructor(public restaurant: Restaurant, public activeUsers: number, public lastCashup: Moment) {}
}
