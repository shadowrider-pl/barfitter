import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrderedProductStatus } from 'app/shared/model/ordered-product-status.model';

@Component({
  selector: 'jhi-ordered-product-status-detail',
  templateUrl: './ordered-product-status-detail.component.html'
})
export class OrderedProductStatusDetailComponent implements OnInit {
  orderedProductStatus: IOrderedProductStatus;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ orderedProductStatus }) => {
      this.orderedProductStatus = orderedProductStatus;
    });
  }

  previousState() {
    window.history.back();
  }
}
