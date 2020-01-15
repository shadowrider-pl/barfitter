import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPaymentToCashup, PaymentToCashup } from 'app/shared/model/payment-to-cashup.model';
import { PaymentToCashupService } from './payment-to-cashup.service';
import { ICashup } from 'app/shared/model/cashup.model';
import { CashupService } from 'app/entities/cashup/cashup.service';
import { IPayment } from 'app/shared/model/payment.model';
import { PaymentService } from 'app/entities/payment/payment.service';

@Component({
  selector: 'jhi-payment-to-cashup-update',
  templateUrl: './payment-to-cashup-update.component.html'
})
export class PaymentToCashupUpdateComponent implements OnInit {
  isSaving: boolean;

  cashups: ICashup[];

  payments: IPayment[];

  editForm = this.fb.group({
    id: [],
    totalPayment: [],
    cashup: [],
    payment: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected paymentToCashupService: PaymentToCashupService,
    protected cashupService: CashupService,
    protected paymentService: PaymentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ paymentToCashup }) => {
      this.updateForm(paymentToCashup);
    });
    this.cashupService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICashup[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICashup[]>) => response.body)
      )
      .subscribe((res: ICashup[]) => (this.cashups = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.paymentService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IPayment[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPayment[]>) => response.body)
      )
      .subscribe((res: IPayment[]) => (this.payments = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(paymentToCashup: IPaymentToCashup) {
    this.editForm.patchValue({
      id: paymentToCashup.id,
      totalPayment: paymentToCashup.totalPayment,
      cashup: paymentToCashup.cashup,
      payment: paymentToCashup.payment
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const paymentToCashup = this.createFromForm();
    if (paymentToCashup.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentToCashupService.update(paymentToCashup));
    } else {
      this.subscribeToSaveResponse(this.paymentToCashupService.create(paymentToCashup));
    }
  }

  private createFromForm(): IPaymentToCashup {
    return {
      ...new PaymentToCashup(),
      id: this.editForm.get(['id']).value,
      totalPayment: this.editForm.get(['totalPayment']).value,
      cashup: this.editForm.get(['cashup']).value,
      payment: this.editForm.get(['payment']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentToCashup>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackCashupById(index: number, item: ICashup) {
    return item.id;
  }

  trackPaymentById(index: number, item: IPayment) {
    return item.id;
  }
}
