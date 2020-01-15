import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
// import { BarfitterAdminModule } from '../../../admin/admin.module';
import { ActivePaymentService } from '../../active-entities/active-payment.service';
import { ActiveDeskService } from '../../active-entities/active-desk.service';
import { ProductsOfCategoryService } from '../../active-entities/products-of-category.service';
import { OrderWithProductsService } from '../../active-entities/order-with-products.service';
import {
  FastOrderService,
  FastOrderPopupService,
  //    FastOrderComponent,
  //    FastOrderDetailComponent,
  FastOrderDialogComponent,
  //    OrderOpenedPopupComponent,
  //    OrderOpenedDeletePopupComponent,
  //    FastOrderDeleteDialogComponent,
  //    newOrderRoute,
  fastOrderPopupRoute,
  FastOrderPopupComponent,
  OrderOpenedResolvePagingParams,
  ProductsToCategoryForFastOrderService
} from './';

const ENTITY_STATES = [
  //    ...newOrderRoute,
  ...fastOrderPopupRoute
];

@NgModule({
  imports: [
    BarfitterSharedModule,
    // BarfitterAdminModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [
    FastOrderDialogComponent,
    FastOrderPopupComponent
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
    FastOrderDialogComponent,
    FastOrderPopupComponent
  ],
  providers: [
    //        NewOrderService,
    //        NewOrderPopupService,
    //        OrderOpenedResolvePagingParams,
    ActivePaymentService,
    ActiveDeskService,
    ProductsOfCategoryService,
    OrderWithProductsService,
    FastOrderService,
    ProductsToCategoryForFastOrderService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterFastOrderModule {}
