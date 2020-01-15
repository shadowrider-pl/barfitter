import { ProductOnStock } from '../../../shared/model/product-on-stock.model';
import { Product } from '../../../shared/model/product.model';
import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from './stock.service';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class StockPopupService {
  private ngbModalRef: NgbModalRef;

  constructor(private modalService: NgbModal, private router: Router, private stockService: StockService) {
    this.ngbModalRef = null;
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.stockService.find(id).subscribe((stockResponse: HttpResponse<ProductOnStock>) => {
          const stock: ProductOnStock = stockResponse.body;
          this.ngbModalRef = this.stockModalRef(component, stock);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.stockModalRef(component, new ProductOnStock());
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  openOutOfStock(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.stockService.findOutOfStock(id).subscribe((stockResponse: HttpResponse<Product>) => {
          const stock: Product = stockResponse.body;
          this.ngbModalRef = this.productModalRef(component, stock);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.productModalRef(component, new Product());
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  stockModalRef(component: Component, stock: ProductOnStock): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.stock = stock;
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

  productModalRef(component: Component, stock: Product): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.stock = stock;
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
