import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrderOpened } from 'app/shared/model/order-opened.model';
import { OrderOpenedService } from './order-opened.service';

@Component({
  selector: 'jhi-order-opened-delete-dialog',
  templateUrl: './order-opened-delete-dialog.component.html'
})
export class OrderOpenedDeleteDialogComponent {
  orderOpened: IOrderOpened;

  constructor(
    protected orderOpenedService: OrderOpenedService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.orderOpenedService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'orderOpenedListModification',
        content: 'Deleted an orderOpened'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-order-opened-delete-popup',
  template: ''
})
export class OrderOpenedDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ orderOpened }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(OrderOpenedDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.orderOpened = orderOpened;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/order-opened', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/order-opened', { outlets: { popup: null } }]);
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
