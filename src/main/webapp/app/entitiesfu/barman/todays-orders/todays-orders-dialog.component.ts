import { OrderClosedService } from '../../../entities/order-closed/order-closed.service';
import { OrderClosed } from '../../../shared/model/order-closed.model';
import { Payment } from '../../../shared/model/payment.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TodaysOrders } from './todays-orders.model';
import { TodaysOrdersPopupService } from './todays-orders-popup.service';
import { TodaysOrdersService } from './todays-orders.service';
import { OrderClosedWithProducts } from '../../models/order-closed-with-products.model';
import { ActivePaymentService } from '../../active-entities/active-payment.service';

@Component({
  selector: 'jhi-todays-orders-dialog',
  templateUrl: './todays-orders-dialog.component.html'
})
export class TodaysOrdersDialogComponent implements OnInit {
  todaysOrders = null;
  isSaving: boolean;
  showChangePaymentButton = true;
  activePayments = [];
  paymentChanged = false;
  paymentChangedDescription = null;
  orderClosed: OrderClosed;
  deskDescription = null;

  ordercloseds: OrderClosedWithProducts[];

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private todaysOrdersService: TodaysOrdersService,
    private eventManager: JhiEventManager,
    private activePaymentService: ActivePaymentService,
    private orderClosedService: OrderClosedService
  ) {}

  changePayment(paymentId) {
    //    console.log("this.todaysOrders.payment.id: " + this.todaysOrders.payment.id);
    this.todaysOrders.payment.id = paymentId;
    this.showChangePaymentButton = true;
    this.paymentChanged = true;
    if (paymentId !== 1 && paymentId !== 2) {
      for (let i = 0; i < this.activePayments.length; i++) {
        if (this.activePayments[i].id === paymentId) {
          this.paymentChangedDescription = this.activePayments[i].description;
          break;
        }
      }
    }
  }

  showPayments() {
    this.showChangePaymentButton = false;
  }

  ngOnInit() {
    this.isSaving = false;
    this.activePaymentService
      .query()
      .subscribe((res: HttpResponse<Payment[]>) => (this.activePayments = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.todaysOrders.id !== undefined) {
      this.orderClosedService.find(this.todaysOrders.id).subscribe((orderClosed: HttpResponse<OrderClosed>) => {
        this.orderClosed = orderClosed.body;
        this.orderClosed.payment.id = this.todaysOrders.payment.id;
        this.subscribeToSaveResponse(this.todaysOrdersService.update(this.orderClosed));
      });
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<TodaysOrders>>) {
    result.subscribe((res: HttpResponse<TodaysOrders>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: TodaysOrders) {
    this.eventManager.broadcast({ name: 'todaysOrdersListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackOrderClosedById(index: number, item: OrderClosedWithProducts) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-todays-orders-popup',
  template: ''
})
export class TodaysOrdersPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private todaysOrdersPopupService: TodaysOrdersPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.todaysOrdersPopupService.open(TodaysOrdersDialogComponent as Component, params['id']);
      } else {
        this.todaysOrdersPopupService.open(TodaysOrdersDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
