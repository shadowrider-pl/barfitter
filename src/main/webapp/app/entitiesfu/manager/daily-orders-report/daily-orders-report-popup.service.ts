import { OrderClosedWithProducts } from '../../models/order-closed-with-products.model';
import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DailyOrdersReportService } from './daily-orders-report.service';

@Injectable()
export class DailyOrdersReportPopupService {
  private ngbModalRef: NgbModalRef;

  constructor(private modalService: NgbModal, private router: Router, private dailyOrdersReportService: DailyOrdersReportService) {
    this.ngbModalRef = null;
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.dailyOrdersReportService.findOrder(id).subscribe((dailyOrdersReportResponse: HttpResponse<OrderClosedWithProducts>) => {
          const dailyOrdersReport: OrderClosedWithProducts = dailyOrdersReportResponse.body;
          this.ngbModalRef = this.dailyOrdersReportModalRef(component, dailyOrdersReport);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.dailyOrdersReportModalRef(component, new OrderClosedWithProducts());
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  dailyOrdersReportModalRef(component: Component, dailyOrdersReport: OrderClosedWithProducts): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.dailyOrdersReport = dailyOrdersReport;
    modalRef.result.then(
      result => {
        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
        this.ngbModalRef = null;
      },
      reason => {
        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
        this.ngbModalRef = null;
      }
    );
    return modalRef;
  }
}
