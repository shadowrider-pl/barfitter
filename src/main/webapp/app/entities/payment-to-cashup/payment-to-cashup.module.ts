import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { PaymentToCashupComponent } from './payment-to-cashup.component';
import { PaymentToCashupDetailComponent } from './payment-to-cashup-detail.component';
import { PaymentToCashupUpdateComponent } from './payment-to-cashup-update.component';
import { PaymentToCashupDeletePopupComponent, PaymentToCashupDeleteDialogComponent } from './payment-to-cashup-delete-dialog.component';
import { paymentToCashupRoute, paymentToCashupPopupRoute } from './payment-to-cashup.route';

const ENTITY_STATES = [...paymentToCashupRoute, ...paymentToCashupPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    PaymentToCashupComponent,
    PaymentToCashupDetailComponent,
    PaymentToCashupUpdateComponent,
    PaymentToCashupDeleteDialogComponent,
    PaymentToCashupDeletePopupComponent
  ],
  entryComponents: [PaymentToCashupDeleteDialogComponent]
})
export class BarfitterPaymentToCashupModule {}
