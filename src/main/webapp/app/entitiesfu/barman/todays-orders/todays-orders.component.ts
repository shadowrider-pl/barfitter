import { AccountService } from 'app/core/auth/account.service';
import { Payment } from '../../../shared/model/payment.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { OrderClosedWithProducts } from '../../models/order-closed-with-products.model';
import { TodaysOrdersService } from './todays-orders.service';
import { TodaysOrders } from './';
import { ActivePaymentService } from '../../active-entities/active-payment.service';

@Component({
  selector: 'jhi-todays-orders',
  templateUrl: './todays-orders.component.html',
  styleUrls: ['../../../../app/../content/css/scroll-buttons.scss']
})
export class TodaysOrdersComponent implements OnInit, OnDestroy {
  ordersSpinner: boolean;
  todaysOrders = [];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  payments = [];
  sums = [];
  date = null;
  total = 0;
  scrollInPixels = 200;

  constructor(
    private todaysOrdersService: TodaysOrdersService,
    private paymentService: ActivePaymentService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  showScrollButtons() {
    if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && document.getElementById('upButton') !== null) {
      document.getElementById('upButton').style.display = 'block';
    } else {
      document.getElementById('upButton').style.display = 'none';
    }

    if (
      (document.body.scrollTop > document.body.scrollHeight - window.innerHeight * 1.05 ||
        document.documentElement.scrollTop > document.documentElement.scrollHeight - window.innerHeight * 1.05) &&
      document.getElementById('downButton') !== null
    ) {
      document.getElementById('downButton').style.display = 'none';
    } else {
      document.getElementById('downButton').style.display = 'block';
    }
    return null;
  }

  scrollDown() {
    window.scrollBy({
      top: this.scrollInPixels,
      left: 0,
      behavior: 'smooth'
    });
  }

  scrollUp() {
    window.scrollBy({
      top: -1 * this.scrollInPixels,
      left: 0,
      behavior: 'smooth'
    });
  }

  setSelectedOrderToFalse() {
    for (let i = 0; i < this.todaysOrders.length; i++) {
      this.todaysOrders[i].IsSelectedOrder = false;
    }
  }

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
    this.ordersSpinner = true;
    this.todaysOrdersService.query().subscribe(
      (res: HttpResponse<TodaysOrders[]>) => {
        this.todaysOrders = res.body;
        if (this.todaysOrders.length > 0) {
          this.date = this.todaysOrders[0].openingTime;
        }
        this.loadAllActivePayments(this.todaysOrders);
        this.currentSearch = '';
        this.setSelectedOrderToFalse();
        this.ordersSpinner = false;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }
  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInTodaysOrders();
    window.addEventListener('scroll', this.showScrollButtons, true);
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
    window.removeEventListener('scroll', this.showScrollButtons, true);
  }

  trackId(index: number, item: OrderClosedWithProducts) {
    return item.id;
  }
  registerChangeInTodaysOrders() {
    this.eventSubscriber = this.eventManager.subscribe('todaysOrdersListModification', response => this.loadAll());
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
