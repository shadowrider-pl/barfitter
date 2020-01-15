import { ICashup } from 'app/shared/model/cashup.model';
import { IPayment } from 'app/shared/model/payment.model';

export interface IPaymentToCashup {
  id?: number;
  totalPayment?: number;
  cashup?: ICashup;
  payment?: IPayment;
}

export class PaymentToCashup implements IPaymentToCashup {
  constructor(public id?: number, public totalPayment?: number, public cashup?: ICashup, public payment?: IPayment) {}
}
