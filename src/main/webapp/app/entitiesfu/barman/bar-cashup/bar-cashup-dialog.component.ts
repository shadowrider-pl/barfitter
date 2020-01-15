import { Cashup } from '../../../shared/model/cashup.model';
import { Payment } from '../../../shared/model/payment.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { BarCashupPopupService } from './bar-cashup-popup.service';
import { BarCashupService } from './bar-cashup.service';
import { ActivePaymentService } from '../../active-entities/active-payment.service';
import { OrderWithProducts } from '../../models/order-opened-with-products.model';
import { NewDayService } from '../new-day/new-day.service';
import { OrderWithProductsService } from '../../active-entities/order-with-products.service';
import { TodaysOrdersService, TodaysOrders } from '../todays-orders';
import { BarCashup } from './';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'jhi-bar-cashup-dialog',
  templateUrl: './bar-cashup-dialog.component.html'
})
export class BarCashupDialogComponent implements OnInit {
  barCashup: BarCashup;
  isSaving: boolean;
  activePayments: Payment[];
  todaysOrders = [];
  lastCashup = null;
  orderOpeneds = [];
  sums = [];
  total = 0;
  cash = 0;
  spinner = true;

  constructor(
    private todaysOrdersService: TodaysOrdersService,
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private barCashupService: BarCashupService,
    private activePaymentService: ActivePaymentService,
    private newDayService: NewDayService,
    private orderWithProductsService: OrderWithProductsService,
    private datePipe: DatePipe,
    private eventManager: JhiEventManager
  ) {}

  sumPayments(orders) {
    for (let i = 0; i < this.activePayments.length; i++) {
      this.sums[i] = { payment: this.activePayments[i], amount: 0 };
      for (let j = 0; j < orders.length; j++) {
        if (orders[j].payment.id === this.sums[i].payment.id) {
          this.sums[i].amount = this.sums[i].amount + orders[j].total;
        }
      }
      this.total += this.sums[i].amount;
      if (i === 0) {
        this.cash = this.sums[i].amount;
      }
    }
    this.spinner = false;
  }

  loadActivePayments() {
    this.activePaymentService.query().subscribe(
      (res: HttpResponse<Payment[]>) => {
        this.activePayments = res.body;
        this.loadAllOrdersClosed();
        this.loadAllOrdersOpened();
        this.loadLastCashup();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  loadAllOrdersOpened() {
    this.orderWithProductsService.query().subscribe(
      (res: HttpResponse<OrderWithProducts[]>) => {
        this.orderOpeneds = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  loadLastCashup() {
    this.newDayService.query().subscribe((cashupResponse: HttpResponse<Cashup>) => {
      this.lastCashup = cashupResponse.body;
      //      this.lastCashup.barmanLoginTime = this.datePipe
      //        .transform(this.lastCashup.barmanLoginTime, 'yyyy-MM-ddTHH:mm:ss');
      //      this.lastCashup.cashupTime = this.datePipe
      //        .transform(this.lastCashup.cashupTime, 'yyyy-MM-ddTHH:mm:ss');
    });
  }

  loadAllOrdersClosed() {
    this.todaysOrdersService.query().subscribe(
      (res: HttpResponse<TodaysOrders[]>) => {
        this.todaysOrders = res.body;
        this.sumPayments(this.todaysOrders);
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnInit() {
    this.isSaving = false;
    this.spinner = true;
    this.loadActivePayments();
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.lastCashup.id !== undefined) {
      this.lastCashup.totalSale = this.total;
      this.subscribeToSaveResponse(this.newDayService.update(this.lastCashup));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<BarCashup>>) {
    result.subscribe((res: HttpResponse<BarCashup>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: BarCashup) {
    this.eventManager.broadcast({ name: 'barCashupListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }
}

@Component({
  selector: 'jhi-bar-cashup-popup',
  template: ''
})
export class BarCashupPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private barCashupPopupService: BarCashupPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.barCashupPopupService.open(BarCashupDialogComponent as Component, params['id']);
      } else {
        this.barCashupPopupService.open(BarCashupDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
