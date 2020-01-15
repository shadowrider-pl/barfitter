import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductOrdered } from 'app/shared/model/product-ordered.model';

@Component({
  selector: 'jhi-product-ordered-detail',
  templateUrl: './product-ordered-detail.component.html'
})
export class ProductOrderedDetailComponent implements OnInit {
  productOrdered: IProductOrdered;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ productOrdered }) => {
      this.productOrdered = productOrdered;
    });
  }

  previousState() {
    window.history.back();
  }
}
