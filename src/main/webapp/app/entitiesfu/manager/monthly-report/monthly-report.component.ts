import { AccountService } from 'app/core/auth/account.service';
import { Cashup } from '../../../shared/model/cashup.model';
import { Payment } from '../../../shared/model/payment.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PaymentService } from '../payment/payment.service';
import { CashupWithPayments } from './cashup-with-payments.model';
import { MonthlyReportToDropdownService } from './monthly-report-to-dropdown.service';
import { MonthlyReportService } from './monthly-report.service';

@Component({
  selector: 'jhi-substitutes',
  templateUrl: './monthly-report.component.html'
})
export class MonthlyReportComponent implements OnInit, OnDestroy {
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  payments: Payment[];
  cashups: CashupWithPayments[];
  months = null;
  monthX = null;
  total = 0;
  startDate = null;
  endDate = null;
  sums = [];
  monthlyReport = null;

  constructor(
    private monthlyReportService: MonthlyReportService,
    private monthlyReportToDropdownService: MonthlyReportToDropdownService,
    private jhiAlertService: JhiAlertService,
    private paymentService: PaymentService,
    private accountService: AccountService
  ) {
    //        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
    //            this.activatedRoute.snapshot.params['search'] : '';
  }

  loadAll() {
    this.monthlyReportService.query().subscribe(
      (res: HttpResponse<CashupWithPayments[]>) => {
        this.onCashupWithPaymentsSuccess(res.body, res.headers);
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  private onCashupWithPaymentsSuccess(data, headers) {
    this.cashups = data;
    if (this.cashups !== undefined && this.cashups.length > 0) {
      // check if last cashup is closed, if not - delete it
      if (this.cashups[this.cashups.length - 1].cashup.cashupTime == null) {
        this.cashups.splice(this.cashups.length - 1, 1);
      }
    }
    this.loadAllActivePayments();
  }

  loadAllActivePayments() {
    this.paymentService.query().subscribe(
      (res: HttpResponse<Payment[]>) => {
        this.onPaymentsSuccess(res.body, res.headers);
        this.sumPayments(this.cashups);
        this.loadMonths();
        this.monthlyTotal(this.cashups);
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  private onPaymentsSuccess(data, headers) {
    this.payments = data;
  }

  sumPayments(loadedCashupsWithPayments) {
    this.total = 0;
    for (let i = 0; i < this.payments.length; i++) {
      this.sums[i] = { payment: this.payments[i], amount: 0 };
    }
    for (let j = 0; j < loadedCashupsWithPayments.length; j++) {
      for (let k = 0; k < loadedCashupsWithPayments[j].paymentsToCashup.length; k++) {
        for (let p = 0; p < this.sums.length; p++) {
          if (loadedCashupsWithPayments[j].paymentsToCashup[k].payment.id === this.sums[p].id) {
            this.sums[p].amount = this.sums[p].amount + loadedCashupsWithPayments[j].paymentsToCashup[k].totalPayment;
            this.total += this.sums[p].amount;
          }
        }
      }
    }
  }

  loadMonths() {
    this.monthlyReportToDropdownService.query().subscribe(
      (res: HttpResponse<Cashup[]>) => {
        this.onCashupSuccess(res.body, res.headers);
        if (this.monthX == null) {
          this.monthX = this.months[0].id;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  changeMonth(id) {
    this.monthlyReportService.find(id).subscribe(
      (res: HttpResponse<CashupWithPayments[]>) => {
        this.onCashupWithPaymentsSuccess(res.body, res.headers);
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  monthlyTotal(cashups) {
    if (cashups !== undefined) {
      this.total = 0;
      //          console.log("cashups.length: "+cashups.length);
      for (let i = 0; i < cashups.length; i++) {
        if (i === 0) {
          this.startDate = cashups[i].cashup.barmanLoginTime;
        }

        if (i === cashups.length - 1) {
          this.endDate = this.cashups[i].cashup.barmanLoginTime;
        }
        this.total += cashups[i].cashup.totalSale;

        for (let j = 0; j < cashups[i].paymentsToCashup.length; j++) {
          //          console.log("cashups[i]: "+JSON.stringify(cashups[i].paymentsToCashup[j].payment));

          for (let k = 0; k < this.payments.length; k++) {
            if (this.sums[k] == null) {
              this.sums[k] = { payment: this.payments[k], amount: 0 };
            }

            if (cashups[i].paymentsToCashup[j].payment.id === this.sums[k].payment.id) {
              this.sums[k].amount = this.sums[k].amount + cashups[i].paymentsToCashup[j].totalPayment;
            }
          }
        }
      }
      return this.total;
    }
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    //    this.registerChangeInSubstitutes();
  }
  ngOnDestroy() {
    //    this.eventManager.destroy(this.eventSubscriber);
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }

  private onCashupSuccess(data, headers) {
    this.months = data;
  }
}
