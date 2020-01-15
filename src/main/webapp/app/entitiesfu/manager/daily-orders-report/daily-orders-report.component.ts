import { AccountService } from 'app/core/auth/account.service';
import { Cashup } from '../../../shared/model/cashup.model';
import { Payment } from '../../../shared/model/payment.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DailyOrdersReport } from './daily-orders-report.model';
import { DailyOrdersReportService } from './daily-orders-report.service';
import { ActivePaymentService } from '../../active-entities/active-payment.service';
import { OrderClosedWithProducts } from '../../models/order-closed-with-products.model';
import * as moment from 'moment';

@Component({
  selector: 'jhi-daily-orders-report',
  templateUrl: './daily-orders-report.component.html'
})
export class DailyOrdersReportComponent implements OnInit, OnDestroy {
  dailyOrdersReports: DailyOrdersReport[];
  currentAccount: any;
  eventSubscriber: Subscription;
  noOrders: boolean;
  todaysOrders = [];
  ordersToPrint = [];
  payments = [];
  sums = [];
  date = null;
  total = 0;
  cashups: Cashup[];
  dateSpinner = false;
  ordersSpinner = false;
  cashupX = null;

  constructor(
    private dailyOrdersReportService: DailyOrdersReportService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private accountService: AccountService,
    private paymentService: ActivePaymentService
  ) {}

  showProducts(order) {
    if (order.IsSelectedOrder === false) {
      order.IsSelectedOrder = true;
    } else {
      order.IsSelectedOrder = false;
    }
  }

  sumPayments(orders, payments) {
    for (let i = 0; i < payments.length; i++) {
      this.sums[i] = { payment: payments[i], amount: 0 };

      for (let ii = 0; ii < orders.length; ii++) {
        if (orders[ii].payment.id === this.sums[i].payment.id) {
          this.sums[i].amount = this.sums[i].amount + orders[ii].total;
        }
      }
      this.total += this.sums[i].amount;
    }
  }

  loadAllActivePayments(orders) {
    this.paymentService.query().subscribe(
      (res: HttpResponse<Payment[]>) => {
        this.payments = res.body;
        this.sumPayments(orders, this.payments);
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  loadAll() {
    this.dateSpinner = true;
    this.ordersSpinner = true;
    this.dailyOrdersReportService.query().subscribe(
      (res: HttpResponse<OrderClosedWithProducts[]>) => {
        this.todaysOrders = res.body;
        this.ordersSpinner = false;
        //        this.addDuration();
        if (this.todaysOrders.length < 1) {
          this.noOrders = true;
        }
        this.loadAllActivePayments(this.todaysOrders);
        this.setSelectedOrderToFalse();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );

    this.dailyOrdersReportService.queryCashups().subscribe(
      (res: HttpResponse<Cashup[]>) => {
        this.cashups = res.body;
        this.dateSpinner = false;
        this.cashupX = this.cashups[0].id;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  getTimeDifference(start, end) {
    const startDate = moment(start);
    const endDate = moment(end);
    return moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
  }

  showRedBadge(start, end) {
    const startDate = moment(start);
    const endDate = moment(end);
    let result = false;
    const diff = +moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
    if (diff < 30) {
      result = false;
    } else {
      result = true;
    }
    return result;
  }

  setSelectedOrderToFalse() {
    for (let i = 0; i < this.todaysOrders.length; i++) {
      this.todaysOrders[i].IsSelectedOrder = false;
    }
  }

  changeDate(cashupX) {
    this.total = 0;
    this.ordersSpinner = true;
    this.dailyOrdersReportService.findCashup(cashupX).subscribe(
      (res: HttpResponse<OrderClosedWithProducts[]>) => {
        this.todaysOrders = res.body;
        this.ordersSpinner = false;
        if (this.todaysOrders.length < 1) {
          this.noOrders = true;
        }
        this.loadAllActivePayments(this.todaysOrders);
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInDailyOrdersReports();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: DailyOrdersReport) {
    return item.id;
  }
  registerChangeInDailyOrdersReports() {
    this.eventSubscriber = this.eventManager.subscribe('dailyOrdersReportListModification', response => this.loadAll());
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
