import { OrderOpened } from '../../../shared/model/order-opened.model';
import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { ActiveOrdersOpenedService } from '../../active-entities/active-orders-opened.service';

@Injectable()
export class OrdersPopupService {
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
        this.orderOpenedService.find(id).subscribe((orderOpenedResponse: HttpResponse<OrderOpened>) => {
          const orderOpened: OrderOpened = orderOpenedResponse.body;
          //                        orderOpened.openingTime = this.datePipe
          //                            .transform(orderOpened.openingTime, 'yyyy-MM-ddTHH:mm:ss');
          //                        orderOpened.closingTime = this.datePipe
          //                            .transform(orderOpened.closingTime, 'yyyy-MM-ddTHH:mm:ss');
          this.ngbModalRef = this.orderOpenedModalRef(component, orderOpened);
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
