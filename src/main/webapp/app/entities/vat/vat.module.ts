import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { VatComponent } from './vat.component';
import { VatDetailComponent } from './vat-detail.component';
import { VatUpdateComponent } from './vat-update.component';
import { VatDeletePopupComponent, VatDeleteDialogComponent } from './vat-delete-dialog.component';
import { vatRoute, vatPopupRoute } from './vat.route';

const ENTITY_STATES = [...vatRoute, ...vatPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [VatComponent, VatDetailComponent, VatUpdateComponent, VatDeleteDialogComponent, VatDeletePopupComponent],
  entryComponents: [VatDeleteDialogComponent]
})
export class BarfitterVatModule {}
