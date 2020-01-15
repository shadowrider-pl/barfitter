import { ProductSold } from '../../../shared/model/product-sold.model';
import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TodaysOrders } from './todays-orders.model';
import { TodaysOrdersService } from './todays-orders.service';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

@Injectable()
export class TodaysOrdersPopupService {
  private ngbModalRef: NgbModalRef;
  sendingTime = null;
  acceptingTime = null;
  finishingTime = null;
  takingTime = null;

  constructor(private modalService: NgbModal, private router: Router, private todaysOrdersService: TodaysOrdersService) {
    this.ngbModalRef = null;
  }

  openProduct(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.todaysOrdersService.findProduct(id).subscribe((productSoldResponse: HttpResponse<ProductSold>) => {
          const productSold: ProductSold = productSoldResponse.body;
          this.ngbModalRef = this.todaysOrdersProductsModalRef(component, productSold);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.todaysOrdersProductsModalRef(component, new TodaysOrders());
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.todaysOrdersService.find(id).subscribe((todaysOrdersResponse: HttpResponse<TodaysOrders>) => {
          const todaysOrders: TodaysOrders = todaysOrdersResponse.body;
          this.ngbModalRef = this.todaysOrdersModalRef(component, todaysOrders);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.todaysOrdersModalRef(component, new TodaysOrders());
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  todaysOrdersProductsModalRef(component: Component, productSold: ProductSold): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.todaysOrders = productSold;
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

  todaysOrdersModalRef(component: Component, todaysOrders: TodaysOrders): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.todaysOrders = todaysOrders;
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
