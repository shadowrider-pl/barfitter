import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
// import { BarfitterAdminModule } from '../../../admin/admin.module';
import { ActiveDeskService } from '../../active-entities/active-desk.service';
import { ActiveOrdersOpenedService } from '../../active-entities/active-orders-opened.service';

import {
  allOrdersRoute,
  AllOrdersComponent
  //    FastOrderService,
  //    FastOrderPopupService,
  //    FastOrderComponent,
  //    FastOrderDetailComponent,
  //    FastOrderDialogComponent,
  //    OrderOpenedPopupComponent,
  //    OrderOpenedDeletePopupComponent,
  //    FastOrderDeleteDialogComponent,
  //    newOrderRoute,
  //    fastOrderPopupRoute,
  //    FastOrderPopupComponent,
  //    OrderOpenedResolvePagingParams,
} from './';

const ENTITY_STATES = [
  ...allOrdersRoute
  //    ...fastOrderPopupRoute,
];

@NgModule({
  imports: [
    BarfitterSharedModule,
    // BarfitterAdminModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [
    AllOrdersComponent
    //      FastOrderDialogComponent,
    //      FastOrderPopupComponent
    //        NewOrderComponent,
    //        NewOrderDetailComponent,
    //        NewOrderDialogComponent,
    //        NewOrderDeleteDialogComponent,
    //        OrderOpenedPopupComponent,
    //        OrderOpenedDeletePopupComponent,
  ],
  entryComponents: [
    //        NewOrderComponent,
    //        NewOrderDialogComponent,
    //        OrderOpenedPopupComponent,
    //        NewOrderDeleteDialogComponent,
    //        OrderOpenedDeletePopupComponent,
    //      FastOrderDialogComponent,
    //      FastOrderPopupComponent
  ],
  providers: [
    //        NewOrderService,
    //        NewOrderPopupService,
    //        OrderOpenedResolvePagingParams,
    //        ActivePaymentService,
    ActiveDeskService,
    ActiveOrdersOpenedService
    //        ProductsOfCategoryService,
    //        OrderWithProductsService,
    //        FastOrderService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterAllOrdersModule {}
