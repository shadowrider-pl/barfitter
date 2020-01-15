import { Cashup } from '../../../shared/model/cashup.model';
import { PaymentToCashup } from '../../../shared/model/payment-to-cashup.model';
export class CashupWithPayments {
  constructor(public cashup: Cashup, public paymentsToCashup: PaymentToCashup[]) {}
}
