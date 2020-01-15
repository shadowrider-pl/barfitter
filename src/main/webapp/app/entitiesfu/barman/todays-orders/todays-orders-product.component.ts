import { ProductSold } from '../../../shared/model/product-sold.model';
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
import { Subscription } from 'rxjs';
import * as moment from 'moment';
// import { ProductSoldService } from './product-sold.service';

@Component({
  selector: 'jhi-todays-orders-product',
  templateUrl: './todays-orders-product.component.html'
})
export class TodaysOrdersProductComponent implements OnInit {
  todaysOrders = null;
  productSold: ProductSold;
  private subscription: Subscription;
  private eventSubscriber: Subscription;
  sendingTime = null;
  acceptingTime = null;
  finishingTime = null;
  takingTime = null;

  constructor(
    private eventManager: JhiEventManager,
    public activeModal: NgbActiveModal,
    private productSoldService: TodaysOrdersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.todaysOrders.sendTime != null) {
      const startDate = moment(this.todaysOrders.orderedTime);
      const endDate = moment(this.todaysOrders.sendTime);
      this.sendingTime = moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
    }
    if (this.todaysOrders.acceptedTime != null) {
      const startDate = this.todaysOrders.sendTime;
      const endDate = this.todaysOrders.acceptedTime;
      this.acceptingTime = moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
    }
    if (this.todaysOrders.finishedTime != null) {
      const startDate = this.todaysOrders.acceptedTime;
      const endDate = this.todaysOrders.finishedTime;
      this.finishingTime = moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
    }
    if (this.todaysOrders.takenTime != null) {
      const startDate = this.todaysOrders.finishedTime;
      const endDate = this.todaysOrders.takenTime;
      this.takingTime = moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
    }
  }

  //  ngOnDestroy() {
  //  }

  clear() {
    this.activeModal.dismiss('cancel');
  }
}

@Component({
  selector: 'jhi-todays-orders-product-popup',
  template: ''
})
export class TodaysOrdersProductPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private todaysOrdersPopupService: TodaysOrdersPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.todaysOrdersPopupService.openProduct(TodaysOrdersProductComponent as Component, params['id']);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
