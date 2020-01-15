import { Payment } from '../../../shared/model/payment.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { PaymentPopupService } from './payment-popup.service';
import { PaymentService } from './payment.service';

@Component({
  selector: 'jhi-payment-dialog',
  templateUrl: './payment-dialog.component.html'
})
export class PaymentDialogComponent implements OnInit {
  payment: Payment;
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private paymentService: PaymentService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.payment.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentService.update(this.payment));
    } else {
      this.subscribeToSaveResponse(this.paymentService.create(this.payment));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Payment>>) {
    result.subscribe((res: HttpResponse<Payment>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: Payment) {
    this.eventManager.broadcast({ name: 'paymentListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }
}

@Component({
  selector: 'jhi-payment-popup',
  template: ''
})
export class PaymentPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private paymentPopupService: PaymentPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.paymentPopupService.open(PaymentDialogComponent as Component, params['id']);
      } else {
        this.paymentPopupService.open(PaymentDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
