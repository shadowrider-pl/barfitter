import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductDelivered } from 'app/shared/model/product-delivered.model';

@Component({
  selector: 'jhi-product-delivered-detail',
  templateUrl: './product-delivered-detail.component.html'
})
export class ProductDeliveredDetailComponent implements OnInit {
  productDelivered: IProductDelivered;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ productDelivered }) => {
      this.productDelivered = productDelivered;
    });
  }

  previousState() {
    window.history.back();
  }
}
