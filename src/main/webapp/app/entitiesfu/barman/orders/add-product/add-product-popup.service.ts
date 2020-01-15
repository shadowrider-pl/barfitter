import { OrderOpened } from '../../../../shared/model/order-opened.model';
import { ProductOrdered } from '../../../../shared/model/product-ordered.model';
import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ActiveOrdersOpenedService } from '../../../active-entities/active-orders-opened.service';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class AddProductPopupService {
  private ngbModalRef: NgbModalRef;

  constructor(
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private router: Router,
    private orderOpenedService: ActiveOrdersOpenedService
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
        this.orderOpenedService.find(id).subscribe((productOrderedResponse: HttpResponse<ProductOrdered>) => {
          const productOrdered: ProductOrdered = productOrderedResponse.body;
          //                        productOrdered.orderedTime = this.datePipe
          //                            .transform(productOrdered.orderedTime, 'yyyy-MM-ddTHH:mm:ss');
          //                        productOrdered.acceptedTime = this.datePipe
          //                            .transform(productOrdered.acceptedTime, 'yyyy-MM-ddTHH:mm:ss');
          //                        productOrdered.finishedTime = this.datePipe
          //                            .transform(productOrdered.finishedTime, 'yyyy-MM-ddTHH:mm:ss');
          //                        productOrdered.takenTime = this.datePipe
          //                            .transform(productOrdered.takenTime, 'yyyy-MM-ddTHH:mm:ss');
          //                        if (productOrdered.deliveryDate) {
          //                            productOrdered.deliveryDate = {
          //                                year: productOrdered.deliveryDate.getFullYear(),
          //                                month: productOrdered.deliveryDate.getMonth() + 1,
          //                                day: productOrdered.deliveryDate.getDate()
          //                            };
          //                        }
          //                        productOrdered.sendTime = this.datePipe
          //                            .transform(productOrdered.sendTime, 'yyyy-MM-ddTHH:mm:ss');
          this.ngbModalRef = this.orderOpenedModalRef(component, productOrdered);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.orderOpenedModalRef(component, new OrderOpened());
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  orderOpenedModalRef(component: Component, orderOpened: OrderOpened): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.orderOpened = orderOpened;
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
