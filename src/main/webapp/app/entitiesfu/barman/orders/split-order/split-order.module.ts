import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../../shared/shared.module';
import { ActiveOrdersOpenedService } from '../../../active-entities/active-orders-opened.service';
import { SplitOrderService, SplitOrderComponent, splitOrderRoute } from './';

const ENTITY_STATES = [...splitOrderRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [SplitOrderComponent],
  entryComponents: [SplitOrderComponent],
  providers: [ActiveOrdersOpenedService, SplitOrderService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterSplitOrderModule {}
