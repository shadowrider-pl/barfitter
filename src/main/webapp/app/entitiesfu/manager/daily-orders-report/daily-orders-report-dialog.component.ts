import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DailyOrdersReportPopupService } from './daily-orders-report-popup.service';
import { DailyOrdersReportService } from './daily-orders-report.service';
import { OrderClosedService } from '../../../entities/order-closed/order-closed.service';
import { OrderClosed } from '../../../shared/model/order-closed.model';
import { OrderClosedWithProducts } from '../../models/order-closed-with-products.model';

@Component({
  selector: 'jhi-daily-orders-report-dialog',
  templateUrl: './daily-orders-report-dialog.component.html'
})
export class DailyOrdersReportDialogComponent implements OnInit {
  dailyOrdersReport: OrderClosedWithProducts;
  isSaving: boolean;

  ordercloseds: OrderClosed[];

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private dailyOrdersReportService: DailyOrdersReportService,
    private orderClosedService: OrderClosedService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    //        this.isSaving = false;
    //        this.orderClosedService.query()
    //            .subscribe((res: HttpResponse<OrderClosed[]>) => { this.ordercloseds = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackOrderClosedById(index: number, item: OrderClosed) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-daily-orders-report-popup',
  template: ''
})
export class DailyOrdersReportPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private dailyOrdersReportPopupService: DailyOrdersReportPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.dailyOrdersReportPopupService.open(DailyOrdersReportDialogComponent as Component, params['id']);
      } else {
        this.dailyOrdersReportPopupService.open(DailyOrdersReportDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
