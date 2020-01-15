import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentToCashup } from 'app/shared/model/payment-to-cashup.model';

@Component({
  selector: 'jhi-payment-to-cashup-detail',
  templateUrl: './payment-to-cashup-detail.component.html'
})
export class PaymentToCashupDetailComponent implements OnInit {
  paymentToCashup: IPaymentToCashup;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ paymentToCashup }) => {
      this.paymentToCashup = paymentToCashup;
    });
  }

  previousState() {
    window.history.back();
  }
}
