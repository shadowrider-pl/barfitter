import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductDelivered } from 'app/shared/model/product-delivered.model';
import { ProductDeliveredService } from './product-delivered.service';

@Component({
  selector: 'jhi-product-delivered-delete-dialog',
  templateUrl: './product-delivered-delete-dialog.component.html'
})
export class ProductDeliveredDeleteDialogComponent {
  productDelivered: IProductDelivered;

  constructor(
    protected productDeliveredService: ProductDeliveredService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.productDeliveredService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'productDeliveredListModification',
        content: 'Deleted an productDelivered'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-product-delivered-delete-popup',
  template: ''
})
export class ProductDeliveredDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ productDelivered }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(ProductDeliveredDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.productDelivered = productDelivered;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/product-delivered', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/product-delivered', { outlets: { popup: null } }]);
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
