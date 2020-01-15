import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
// import { BarfitterAdminModule } from '../../../admin/admin.module';
import { ActivePaymentService } from '../../active-entities/active-payment.service';
import { ActiveDeskService } from '../../active-entities/active-desk.service';
import { ProductsOfCategoryService } from '../../active-entities/products-of-category.service';
import { OrderWithProductsService } from '../../active-entities/order-with-products.service';
import {
  NewOrderService,
  //    NewOrderPopupService,
  //    NewOrderDialogComponent,
  //    OrderOpenedPopupComponent,
  //    orderOpenedPopupRoute,
  newOrderRoute,
  NewOrderComponent,
  OrderOpenedResolvePagingParams
} from './';

const ENTITY_STATES = [...newOrderRoute];

@NgModule({
  imports: [
    BarfitterSharedModule,
    // BarfitterAdminModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [NewOrderComponent],
  entryComponents: [NewOrderComponent],
  providers: [
    NewOrderService,
    OrderOpenedResolvePagingParams,
    ActivePaymentService,
    ActiveDeskService,
    ProductsOfCategoryService,
    OrderWithProductsService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterNewOrderModule {}
