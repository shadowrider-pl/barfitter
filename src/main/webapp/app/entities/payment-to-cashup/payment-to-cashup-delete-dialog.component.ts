import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPaymentToCashup } from 'app/shared/model/payment-to-cashup.model';
import { PaymentToCashupService } from './payment-to-cashup.service';

@Component({
  selector: 'jhi-payment-to-cashup-delete-dialog',
  templateUrl: './payment-to-cashup-delete-dialog.component.html'
})
export class PaymentToCashupDeleteDialogComponent {
  paymentToCashup: IPaymentToCashup;

  constructor(
    protected paymentToCashupService: PaymentToCashupService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.paymentToCashupService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'paymentToCashupListModification',
        content: 'Deleted an paymentToCashup'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-payment-to-cashup-delete-popup',
  template: ''
})
export class PaymentToCashupDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ paymentToCashup }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(PaymentToCashupDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.paymentToCashup = paymentToCashup;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/payment-to-cashup', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/payment-to-cashup', { outlets: { popup: null } }]);
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
