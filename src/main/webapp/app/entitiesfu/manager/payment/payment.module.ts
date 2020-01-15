import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  PaymentService,
  PaymentPopupService,
  MPaymentComponent,
  PaymentDetailComponent,
  PaymentDialogComponent,
  PaymentPopupComponent,
  PaymentDeletePopupComponent,
  PaymentDeleteDialogComponent,
  paymentRoute,
  paymentPopupRoute,
  PaymentResolvePagingParams
} from './';

const ENTITY_STATES = [...paymentRoute, ...paymentPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    MPaymentComponent,
    PaymentDetailComponent,
    PaymentDialogComponent,
    PaymentDeleteDialogComponent,
    PaymentPopupComponent,
    PaymentDeletePopupComponent
  ],
  entryComponents: [
    MPaymentComponent,
    PaymentDialogComponent,
    PaymentPopupComponent,
    PaymentDeleteDialogComponent,
    PaymentDeletePopupComponent
  ],
  providers: [PaymentService, PaymentPopupService, PaymentResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterPaymentModule {}
