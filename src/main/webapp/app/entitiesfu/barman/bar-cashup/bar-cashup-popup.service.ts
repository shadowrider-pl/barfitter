import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BarCashup } from './bar-cashup.model';
import { BarCashupService } from './bar-cashup.service';
import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class BarCashupPopupService {
  private ngbModalRef: NgbModalRef;

  constructor(
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private router: Router,
    private barCashupService: BarCashupService
  ) {
    this.ngbModalRef = null;
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.barCashupService.find(id).subscribe((cashupResponse: HttpResponse<BarCashup>) => {
          const barCashup: BarCashup = cashupResponse.body;
          //                    barCashup.barmanLoginTime = this.datePipe
          //                        .transform(barCashup.barmanLoginTime, 'yyyy-MM-ddTHH:mm:ss');
          //                    barCashup.cashupTime = this.datePipe
          //                        .transform(barCashup.cashupTime, 'yyyy-MM-ddTHH:mm:ss');
          this.ngbModalRef = this.barCashupModalRef(component, barCashup);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.barCashupModalRef(component, new BarCashup());
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  barCashupModalRef(component: Component, barCashup: BarCashup): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'sm', backdrop: 'static' });
    modalRef.componentInstance.barCashup = barCashup;
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
