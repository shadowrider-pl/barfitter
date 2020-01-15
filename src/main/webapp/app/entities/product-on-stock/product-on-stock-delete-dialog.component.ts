import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductOnStock } from 'app/shared/model/product-on-stock.model';
import { ProductOnStockService } from './product-on-stock.service';

@Component({
  selector: 'jhi-product-on-stock-delete-dialog',
  templateUrl: './product-on-stock-delete-dialog.component.html'
})
export class ProductOnStockDeleteDialogComponent {
  productOnStock: IProductOnStock;

  constructor(
    protected productOnStockService: ProductOnStockService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.productOnStockService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'productOnStockListModification',
        content: 'Deleted an productOnStock'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-product-on-stock-delete-popup',
  template: ''
})
export class ProductOnStockDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ productOnStock }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(ProductOnStockDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.productOnStock = productOnStock;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/product-on-stock', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/product-on-stock', { outlets: { popup: null } }]);
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
