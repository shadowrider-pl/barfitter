import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  BossVatService,
  VatPopupService,
  VatComponent,
  VatDetailComponent,
  VatDialogComponent,
  VatPopupComponent,
  VatDeletePopupComponent,
  VatDeleteDialogComponent,
  vatRoute,
  vatPopupRoute,
  VatResolvePagingParams
} from './';

const ENTITY_STATES = [...vatRoute, ...vatPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    VatComponent,
    VatDetailComponent,
    VatDialogComponent,
    VatDeleteDialogComponent,
    VatPopupComponent,
    VatDeletePopupComponent
  ],
  entryComponents: [VatComponent, VatDialogComponent, VatPopupComponent, VatDeleteDialogComponent, VatDeletePopupComponent],
  providers: [BossVatService, VatPopupService, VatResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterVatModule {}
