import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICashup } from 'app/shared/model/cashup.model';

@Component({
  selector: 'jhi-cashup-detail',
  templateUrl: './cashup-detail.component.html'
})
export class CashupDetailComponent implements OnInit {
  cashup: ICashup;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ cashup }) => {
      this.cashup = cashup;
    });
  }

  previousState() {
    window.history.back();
  }
}
