import { AccountService } from 'app/core/auth/account.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { PaymentService } from './payment.service';
import { Payment, IPayment } from '../../../shared/model/payment.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-m-payment',
  templateUrl: './m-payment.component.html'
})
export class MPaymentComponent implements OnInit, OnDestroy {
  currentAccount: any;
  payments: Payment[];
  eventSubscriber: Subscription;
  currentSearch: string;
  constructor(
    private paymentService: PaymentService,
    private parseLinks: JhiParseLinks,
    private jhiAlertService: JhiAlertService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: JhiEventManager
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  loadAll() {
    this.paymentService
      .query()
      .subscribe(
        (res: HttpResponse<Payment[]>) => this.onSuccess(res.body, res.headers),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }
  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }
  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInPayments();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IPayment) {
    return item.id;
  }
  registerChangeInPayments() {
    this.eventSubscriber = this.eventManager.subscribe('paymentListModification', response => this.loadAll());
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }

  private onSuccess(data, headers) {
    this.payments = data;
  }
}
