import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductSold } from 'app/shared/model/product-sold.model';

@Component({
  selector: 'jhi-product-sold-detail',
  templateUrl: './product-sold-detail.component.html'
})
export class ProductSoldDetailComponent implements OnInit {
  productSold: IProductSold;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ productSold }) => {
      this.productSold = productSold;
    });
  }

  previousState() {
    window.history.back();
  }
}
