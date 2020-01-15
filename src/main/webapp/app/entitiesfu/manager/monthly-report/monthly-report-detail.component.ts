import { CashupWithPayments } from './cashup-with-payments.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MonthlyReportService } from './monthly-report.service';

@Component({
  selector: 'jhi-cashup-detail',
  templateUrl: './monthly-report-detail.component.html'
})
export class MonthlyReportDetailComponent implements OnInit, OnDestroy {
  cashup: CashupWithPayments;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(private eventManager: JhiEventManager, private monthlyReportService: MonthlyReportService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInCashups();
  }

  load(id) {
    this.monthlyReportService.findCashup(id).subscribe((cashupResponse: HttpResponse<CashupWithPayments>) => {
      this.cashup = cashupResponse.body;
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInCashups() {
    this.eventSubscriber = this.eventManager.subscribe('cashupListModification', response => this.load(this.cashup.cashup.id));
  }
}
