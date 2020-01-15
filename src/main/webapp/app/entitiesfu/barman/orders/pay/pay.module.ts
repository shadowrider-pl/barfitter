import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../../shared/shared.module';
import { ActiveOrdersOpenedService } from '../../../active-entities/active-orders-opened.service';
import { PayPopupComponent, PayPopupService, PayService, PayDialogComponent, payPopupRoute, OrderOpenedResolvePagingParams } from './';

const ENTITY_STATES = [...payPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [PayDialogComponent, PayPopupComponent],
  entryComponents: [PayDialogComponent, PayPopupComponent],
  providers: [ActiveOrdersOpenedService, PayPopupService, PayService, OrderOpenedResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterPayModule {}
