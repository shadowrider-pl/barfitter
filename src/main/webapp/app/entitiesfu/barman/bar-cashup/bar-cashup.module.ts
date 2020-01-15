import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import { BarCashupService, BarCashupPopupService, BarCashupDialogComponent, BarCashupPopupComponent, barCashupPopupRoute } from './';

const ENTITY_STATES = [
  //    ...barCashupRoute,
  ...barCashupPopupRoute
];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [BarCashupDialogComponent, BarCashupPopupComponent],
  entryComponents: [BarCashupDialogComponent, BarCashupPopupComponent],
  providers: [BarCashupService, BarCashupPopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterBarCashupModule {}
