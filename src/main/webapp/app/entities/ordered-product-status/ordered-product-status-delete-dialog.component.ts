import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrderedProductStatus } from 'app/shared/model/ordered-product-status.model';
import { OrderedProductStatusService } from './ordered-product-status.service';

@Component({
  selector: 'jhi-ordered-product-status-delete-dialog',
  templateUrl: './ordered-product-status-delete-dialog.component.html'
})
export class OrderedProductStatusDeleteDialogComponent {
  orderedProductStatus: IOrderedProductStatus;

  constructor(
    protected orderedProductStatusService: OrderedProductStatusService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.orderedProductStatusService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'orderedProductStatusListModification',
        content: 'Deleted an orderedProductStatus'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-ordered-product-status-delete-popup',
  template: ''
})
export class OrderedProductStatusDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ orderedProductStatus }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(OrderedProductStatusDeleteDialogComponent as Component, {
          size: 'lg',
          backdrop: 'static'
        });
        this.ngbModalRef.componentInstance.orderedProductStatus = orderedProductStatus;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/ordered-product-status', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/ordered-product-status', { outlets: { popup: null } }]);
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
