import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { NewDayPopupService } from './new-day-popup.service';
import { NewDayService } from './new-day.service';
import { RestaurantService } from '../../../entities/restaurant/restaurant.service';
import { Cashup, ICashup } from '../../../shared/model/cashup.model';
import { Restaurant } from '../../../shared/model/restaurant.model';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'jhi-cashup-dialog',
  templateUrl: './new-day-dialog.component.html'
})
export class NewDayDialogComponent implements OnInit {
  cashup: Cashup;
  lastCashup: Cashup;
  isSaving: boolean;
  firstDay = true;

  users: User[];

  restaurants: Restaurant[];

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private newDayService: NewDayService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.newDayService.query().subscribe((res: HttpResponse<ICashup>) => {
      this.lastCashup = res.body;
      //      this.lastCashup.barmanLoginTime = this.datePipe
      //        .transform(this.lastCashup.barmanLoginTime, 'yyyy-MM-ddTHH:mm:ss');
      //      this.lastCashup.cashupTime = this.datePipe
      //        .transform(this.lastCashup.cashupTime, 'yyyy-MM-ddTHH:mm:ss');
      if (this.lastCashup.comment === '**********') {
        this.firstDay = true;
      } else {
        this.firstDay = false;
      }
    });
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    const now = new Date();
    this.cashup.barmanLoginTime = moment();
    //    this.cashup.barmanLoginTime = this.datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss');
    if (this.cashup.id !== undefined) {
      this.subscribeToSaveResponse(this.newDayService.update(this.cashup));
    } else {
      this.subscribeToSaveResponse(this.newDayService.create(this.cashup));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Cashup>>) {
    result.subscribe((res: HttpResponse<Cashup>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: Cashup) {
    this.eventManager.broadcast({ name: 'cashupListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }

  trackRestaurantById(index: number, item: Restaurant) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-cashup-popup',
  template: ''
})
export class NewDayPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private cashupPopupService: NewDayPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.cashupPopupService.open(NewDayDialogComponent as Component, params['id']);
      } else {
        this.cashupPopupService.open(NewDayDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
