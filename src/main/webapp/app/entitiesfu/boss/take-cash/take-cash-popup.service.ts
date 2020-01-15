import { Cashup } from '../../../shared/model/cashup.model';
import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TakeCashService } from './take-cash.service';
import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class TakeCashPopupService {
  private ngbModalRef: NgbModalRef;

  constructor(
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private router: Router,
    private takeCashService: TakeCashService
  ) {
    this.ngbModalRef = null;
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      this.takeCashService.query().subscribe((cashupResponse: HttpResponse<Cashup>) => {
        const cashup: Cashup = cashupResponse.body;
        //                        cashup.barmanLoginTime = this.datePipe
        //                            .transform(cashup.barmanLoginTime, 'yyyy-MM-ddTHH:mm:ss');
        //                        cashup.cashupTime = this.datePipe
        //                            .transform(cashup.cashupTime, 'yyyy-MM-ddTHH:mm:ss');
        this.ngbModalRef = this.takeCashModalRef(component, cashup);
        resolve(this.ngbModalRef);
      });

      //            if (id) {
      //                this.takeCashService.query()
      //                  .subscribe((cashupResponse: HttpResponse<Cashup>) => {
      //                        const cashup: Cashup = cashupResponse.body;
      //                    cashup.barmanLoginTime = this.datePipe
      //                        .transform(cashup.barmanLoginTime, 'yyyy-MM-ddTHH:mm:ss');
      //                    cashup.cashupTime = this.datePipe
      //                        .transform(cashup.cashupTime, 'yyyy-MM-ddTHH:mm:ss');
      //                    this.ngbModalRef = this.takeCashModalRef(component, cashup);
      //                    resolve(this.ngbModalRef);
      //                });
      //            } else {
      //                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
      //                setTimeout(() => {
      //                    this.ngbModalRef = this.takeCashModalRef(component, new Cashup());
      //                    resolve(this.ngbModalRef);
      //                }, 0);
      //            }
    });
  }

  takeCashModalRef(component: Component, cashup: Cashup): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cashup = cashup;
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
