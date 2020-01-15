import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductSold } from 'app/shared/model/product-sold.model';
import { ProductSoldService } from './product-sold.service';

@Component({
  selector: 'jhi-product-sold-delete-dialog',
  templateUrl: './product-sold-delete-dialog.component.html'
})
export class ProductSoldDeleteDialogComponent {
  productSold: IProductSold;

  constructor(
    protected productSoldService: ProductSoldService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.productSoldService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'productSoldListModification',
        content: 'Deleted an productSold'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-product-sold-delete-popup',
  template: ''
})
export class ProductSoldDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ productSold }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(ProductSoldDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.productSold = productSold;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/product-sold', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/product-sold', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
