import { ProductDelivered } from '../../../shared/model/product-delivered.model';
import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProductDeliveredService } from './product-delivered.service';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class ProductDeliveredPopupService {
  private ngbModalRef: NgbModalRef;

  constructor(private modalService: NgbModal, private router: Router, private productDeliveredService: ProductDeliveredService) {
    this.ngbModalRef = null;
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.productDeliveredService.find(id).subscribe((productDeliveredResponse: HttpResponse<ProductDelivered>) => {
          const productDelivered: ProductDelivered = productDeliveredResponse.body;
          //                        if (productDelivered.deliveryDate) {
          //                            productDelivered.deliveryDate = {
          //                                year: productDelivered.deliveryDate.getFullYear(),
          //                                month: productDelivered.deliveryDate.getMonth() + 1,
          //                                day: productDelivered.deliveryDate.getDate()
          //                            };
          //                        }
          this.ngbModalRef = this.productDeliveredModalRef(component, productDelivered);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.productDeliveredModalRef(component, new ProductDelivered());
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  productDeliveredModalRef(component: Component, productDelivered: ProductDelivered): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productDelivered = productDelivered;
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
