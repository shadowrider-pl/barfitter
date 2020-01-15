import { ProductSold } from '../../../shared/model/product-sold.model';
import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { SubstitutesService } from './substitutes.service';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class SubstitutesPopupService {
  private ngbModalRef: NgbModalRef;

  constructor(
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private router: Router,
    private substitutesService: SubstitutesService
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
        this.substitutesService.find(id).subscribe((substitutesResponse: HttpResponse<ProductSold>) => {
          const substitutes: ProductSold = substitutesResponse.body;
          //                    substitutes.orderedTime = this.datePipe
          //                        .transform(substitutes.orderedTime, 'yyyy-MM-ddTHH:mm:ss');
          //                    substitutes.acceptedTime = this.datePipe
          //                        .transform(substitutes.acceptedTime, 'yyyy-MM-ddTHH:mm:ss');
          //                    substitutes.finishedTime = this.datePipe
          //                        .transform(substitutes.finishedTime, 'yyyy-MM-ddTHH:mm:ss');
          //                    substitutes.takenTime = this.datePipe
          //                        .transform(substitutes.takenTime, 'yyyy-MM-ddTHH:mm:ss');
          //                    if (substitutes.deliveryDate) {
          //                        substitutes.deliveryDate = {
          //                            year: substitutes.deliveryDate.getFullYear(),
          //                            month: substitutes.deliveryDate.getMonth() + 1,
          //                            day: substitutes.deliveryDate.getDate()
          //                        };
          //                    }
          //                    substitutes.sendTime = this.datePipe
          //                        .transform(substitutes.sendTime, 'yyyy-MM-ddTHH:mm:ss');
          this.ngbModalRef = this.substitutesModalRef(component, substitutes);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.substitutesModalRef(component, new ProductSold());
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  substitutesModalRef(component: Component, substitutes: ProductSold): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.substitutes = substitutes;
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
