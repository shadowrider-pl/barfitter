import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrderClosed } from 'app/shared/model/order-closed.model';

@Component({
  selector: 'jhi-order-closed-detail',
  templateUrl: './order-closed-detail.component.html'
})
export class OrderClosedDetailComponent implements OnInit {
  orderClosed: IOrderClosed;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ orderClosed }) => {
      this.orderClosed = orderClosed;
    });
  }

  previousState() {
    window.history.back();
  }
}
