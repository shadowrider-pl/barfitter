import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BarfitterSharedModule } from '../../../shared/shared.module';
// import { BarfitterAdminModule } from '../../../admin/admin.module';
import { ActiveOrdersOpenedService } from '../../active-entities/active-orders-opened.service';
import {
  ProductsProcessedAtKitchenComponent,
  //    OrderOpenedService,
  ProductsProcessedAtKitchenService,
  productsProcessedAtKitchenRoute
} from './';

const ENTITY_STATES = [...productsProcessedAtKitchenRoute];

@NgModule({
  imports: [
    BarfitterSharedModule,
    // BarfitterAdminModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [ProductsProcessedAtKitchenComponent],
  providers: [ActiveOrdersOpenedService, ProductsProcessedAtKitchenService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterProductsProcessedAtKitchenModule {}
