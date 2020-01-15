import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrderClosed } from 'app/shared/model/order-closed.model';
import { OrderClosedService } from './order-closed.service';

@Component({
  selector: 'jhi-order-closed-delete-dialog',
  templateUrl: './order-closed-delete-dialog.component.html'
})
export class OrderClosedDeleteDialogComponent {
  orderClosed: IOrderClosed;

  constructor(
    protected orderClosedService: OrderClosedService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.orderClosedService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'orderClosedListModification',
        content: 'Deleted an orderClosed'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-order-closed-delete-popup',
  template: ''
})
export class OrderClosedDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ orderClosed }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(OrderClosedDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.orderClosed = orderClosed;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/order-closed', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/order-closed', { outlets: { popup: null } }]);
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
