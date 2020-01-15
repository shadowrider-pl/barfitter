import { OrderClosed } from '../../../shared/model/order-closed.model';
export class DailyOrdersReport {
  constructor(public id?: number, public orderClosed?: OrderClosed) {}
}
