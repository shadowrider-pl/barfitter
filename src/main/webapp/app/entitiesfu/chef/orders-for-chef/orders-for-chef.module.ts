import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
// import { BarfitterAdminModule } from '../../../admin/admin.module';
import { ActiveOrdersOpenedService } from '../../active-entities/active-orders-opened.service';
import { OrdersForChefDetailComponent, ordersForChefRoute } from './';

const ENTITY_STATES = [...ordersForChefRoute];

@NgModule({
  imports: [
    BarfitterSharedModule,
    // BarfitterAdminModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [OrdersForChefDetailComponent],
  entryComponents: [],
  providers: [ActiveOrdersOpenedService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterOrdersForChefModule {}
