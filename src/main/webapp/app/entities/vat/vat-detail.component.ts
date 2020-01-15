import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVat } from 'app/shared/model/vat.model';

@Component({
  selector: 'jhi-vat-detail',
  templateUrl: './vat-detail.component.html'
})
export class VatDetailComponent implements OnInit {
  vat: IVat;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ vat }) => {
      this.vat = vat;
    });
  }

  previousState() {
    window.history.back();
  }
}
