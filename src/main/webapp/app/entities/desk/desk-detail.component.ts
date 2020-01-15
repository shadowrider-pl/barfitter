import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDesk } from 'app/shared/model/desk.model';

@Component({
  selector: 'jhi-desk-detail',
  templateUrl: './desk-detail.component.html'
})
export class DeskDetailComponent implements OnInit {
  desk: IDesk;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ desk }) => {
      this.desk = desk;
    });
  }

  previousState() {
    window.history.back();
  }
}
