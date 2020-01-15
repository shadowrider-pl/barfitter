import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { CashupComponent } from './cashup.component';
import { CashupDetailComponent } from './cashup-detail.component';
import { CashupUpdateComponent } from './cashup-update.component';
import { CashupDeletePopupComponent, CashupDeleteDialogComponent } from './cashup-delete-dialog.component';
import { cashupRoute, cashupPopupRoute } from './cashup.route';

const ENTITY_STATES = [...cashupRoute, ...cashupPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [CashupComponent, CashupDetailComponent, CashupUpdateComponent, CashupDeleteDialogComponent, CashupDeletePopupComponent],
  entryComponents: [CashupDeleteDialogComponent]
})
export class BarfitterCashupModule {}
