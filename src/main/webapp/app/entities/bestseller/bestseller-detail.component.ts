import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBestseller } from 'app/shared/model/bestseller.model';

@Component({
  selector: 'jhi-bestseller-detail',
  templateUrl: './bestseller-detail.component.html'
})
export class BestsellerDetailComponent implements OnInit {
  bestseller: IBestseller;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ bestseller }) => {
      this.bestseller = bestseller;
    });
  }

  previousState() {
    window.history.back();
  }
}
