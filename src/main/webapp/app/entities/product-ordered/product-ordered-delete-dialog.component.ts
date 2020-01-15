import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductOrdered } from 'app/shared/model/product-ordered.model';
import { ProductOrderedService } from './product-ordered.service';

@Component({
  selector: 'jhi-product-ordered-delete-dialog',
  templateUrl: './product-ordered-delete-dialog.component.html'
})
export class ProductOrderedDeleteDialogComponent {
  productOrdered: IProductOrdered;

  constructor(
    protected productOrderedService: ProductOrderedService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.productOrderedService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'productOrderedListModification',
        content: 'Deleted an productOrdered'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-product-ordered-delete-popup',
  template: ''
})
export class ProductOrderedDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ productOrdered }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(ProductOrderedDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.productOrdered = productOrdered;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/product-ordered', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/product-ordered', { outlets: { popup: null } }]);
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
