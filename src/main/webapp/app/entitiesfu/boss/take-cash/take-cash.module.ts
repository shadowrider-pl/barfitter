import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import { TakeCashService, TakeCashPopupService, TakeCashDialogComponent, TakeCashPopupComponent, takeCashPopupRoute } from './';

const ENTITY_STATES = [...takeCashPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [TakeCashDialogComponent, TakeCashPopupComponent],
  entryComponents: [TakeCashDialogComponent, TakeCashPopupComponent],
  providers: [TakeCashService, TakeCashPopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterTakeCashModule {}
