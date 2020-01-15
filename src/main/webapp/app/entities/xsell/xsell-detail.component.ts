import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IXsell } from 'app/shared/model/xsell.model';

@Component({
  selector: 'jhi-xsell-detail',
  templateUrl: './xsell-detail.component.html'
})
export class XsellDetailComponent implements OnInit {
  xsell: IXsell;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ xsell }) => {
      this.xsell = xsell;
    });
  }

  previousState() {
    window.history.back();
  }
}
