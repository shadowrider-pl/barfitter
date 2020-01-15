import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrderOpened } from 'app/shared/model/order-opened.model';

@Component({
  selector: 'jhi-order-opened-detail',
  templateUrl: './order-opened-detail.component.html'
})
export class OrderOpenedDetailComponent implements OnInit {
  orderOpened: IOrderOpened;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ orderOpened }) => {
      this.orderOpened = orderOpened;
    });
  }

  previousState() {
    window.history.back();
  }
}
