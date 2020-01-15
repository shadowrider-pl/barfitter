import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductOnStock } from 'app/shared/model/product-on-stock.model';

@Component({
  selector: 'jhi-product-on-stock-detail',
  templateUrl: './product-on-stock-detail.component.html'
})
export class ProductOnStockDetailComponent implements OnInit {
  productOnStock: IProductOnStock;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ productOnStock }) => {
      this.productOnStock = productOnStock;
    });
  }

  previousState() {
    window.history.back();
  }
}
