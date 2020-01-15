import { OrderClosed } from '../../../shared/model/order-closed.model';
export class TodaysOrders {
  constructor(public id?: number, public orderClosed?: OrderClosed, public openingTime?: any, public closingTime?: any) {}
}
