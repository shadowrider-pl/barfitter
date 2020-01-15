import { OrderOpened } from '../../../../shared/model/order-opened.model';
import { Payment } from '../../../../shared/model/payment.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { PayPopupService } from './pay-popup.service';
import { PayService } from './pay.service';
import { ActiveOrdersOpenedService } from '../../../active-entities/active-orders-opened.service';
import { ActivePaymentService } from '../../../active-entities/active-payment.service';
import * as moment from 'moment';
import { NewDayService } from '../../new-day/new-day.service';
import { ICashup, Cashup } from 'app/shared/model/cashup.model';
@Component({
  selector: 'jhi-order-opened-dialog',
  templateUrl: './pay-dialog.component.html'
})
export class PayDialogComponent implements OnInit {
  orderOpened: any;
  joinedPaymentOrder: OrderOpened;
  isSaving: boolean;
  cash = null;
  joinedPaymentClicked = false;
  joinedPayments = [];
  rest = 0;
  subtotal = 0;
  choosenPayments = [];
  sumCorrected = false;
  deskDescription = null;
  activePayments: Payment[];
  spinner = false;
  lastCashup: Cashup;
  dayOpened: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private payService: PayService,
    private activePaymentService: ActivePaymentService,
    private newDayService: NewDayService,
    private eventManager: JhiEventManager
  ) { }

  jpay() {
    let fullOrder = true;
    const now = moment();
    //    const nowDate = new Date();
    //    const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
    for (let i = 0; i < this.joinedPayments.length; i++) {
      if (this.choosenPayments[i] !== undefined) {
        if (fullOrder) {
          this.orderOpened.closingTime = now;
          this.orderOpened.total = this.choosenPayments[i].amount;
          this.orderOpened.payment = this.choosenPayments[i].payment;
          this.subscribeToSaveResponse(this.payService.update(this.orderOpened));
          fullOrder = false;
        } else {
          this.joinedPaymentOrder = {
            openingTime: this.orderOpened.openingTime,
            total: this.choosenPayments[i].amount,
            comment: this.choosenPayments[i].payment.description + ' -> #' + this.orderOpened.orderId,
            payment: { id: this.choosenPayments[i].payment.id },
            orderId: this.orderOpened.orderId,
            desk: this.orderOpened.desk,
            barman: this.orderOpened.barman,
            closingTime: now
          };

          this.subscribeToSaveResponse(this.payService.create(this.joinedPaymentOrder));
        }
      }
    }
  }

  pay(id) {
    this.spinner = true;
    this.orderOpened.payment.id = id;
  }

  getRest() {
    this.rest = 0;
    this.subtotal = 0;
    this.choosenPayments = [];
    for (let i = 0; i < this.joinedPayments.length; i++) {
      if (this.joinedPayments[i].amount !== 0 && this.joinedPayments[i].amount != null) {
        this.subtotal = this.subtotal + this.joinedPayments[i].amount;
        this.choosenPayments.push(this.joinedPayments[i]);
      }
    }
    if (this.subtotal === this.orderOpened.total) {
      this.sumCorrected = true;
    } else {
      this.sumCorrected = false;
    }
    this.rest = this.orderOpened.total - this.subtotal;
    return this.rest;
  }

  activePaymentsForJoined() {
    for (let i = 0; i < this.activePayments.length; i++) {
      const joinedPayment = { payment: this.activePayments[i], amount: null };
      this.joinedPayments.push(joinedPayment);
    }
  }

  joinedPayment() {
    this.joinedPaymentClicked = !this.joinedPaymentClicked;
  }

  ngOnInit() {
    this.isSaving = false;
    this.spinner = true;
    this.newDayService.query().subscribe((res: HttpResponse<ICashup>) => {
      this.lastCashup = res.body;
      this.lastCashup.id == null ? this.dayOpened = false : this.dayOpened = true
      this.spinner = false;
    });
    this.activePaymentService.query().subscribe(
      (res: HttpResponse<Payment[]>) => {
        this.activePayments = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.deskDescription = this.orderOpened.desk.description;
    this.orderOpened.payment = { id: null };
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    this.orderOpened.closingTime = moment();
    if (this.orderOpened.id !== undefined) {
      this.subscribeToSaveResponse(this.payService.update(this.orderOpened));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<OrderOpened>>) {
    result.subscribe((res: HttpResponse<OrderOpened>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: OrderOpened) {
    this.eventManager.broadcast({ name: 'orderOpenedListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackPaymentById(index: number, item: Payment) {
    return item.id;
  }

  //  trackUserById(index: number, item: User) {
  //    return item.id;
  //  }
}

@Component({
  selector: 'jhi-order-opened-popup',
  template: ''
})
export class PayPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private payPopupService: PayPopupService) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.payPopupService.open(PayDialogComponent as Component, params['id']);
      } else {
        this.payPopupService.open(PayDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
