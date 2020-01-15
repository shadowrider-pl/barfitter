import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BarfitterSharedModule } from '../../../shared/shared.module';
// import { BarfitterAdminModule } from '../../../admin/admin.module';
import { ActiveOrdersOpenedService } from '../../active-entities/active-orders-opened.service';
import {
  //    OrderOpenedService,
  OrdersPopupService,
  OrdersComponent,
  OrdersDetailComponent,
  OrdersDialogComponent,
  OrdersPopupComponent,
  OrdersDeletePopupComponent,
  OrdersDeleteDialogComponent,
  ordersRoute,
  ordersPopupRoute,
  OrderOpenedResolvePagingParams
} from './';

const ENTITY_STATES = [...ordersRoute, ...ordersPopupRoute];

@NgModule({
  imports: [
    BarfitterSharedModule,
    // BarfitterAdminModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [
    OrdersComponent,
    OrdersDetailComponent,
    OrdersDialogComponent,
    OrdersDeleteDialogComponent,
    OrdersPopupComponent,
    OrdersDeletePopupComponent
  ],
  entryComponents: [OrdersComponent, OrdersDialogComponent, OrdersPopupComponent, OrdersDeleteDialogComponent, OrdersDeletePopupComponent],
  providers: [ActiveOrdersOpenedService, OrdersPopupService, OrderOpenedResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterOrdersModule {}
