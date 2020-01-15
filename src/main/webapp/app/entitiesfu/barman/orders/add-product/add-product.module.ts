import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BarfitterSharedModule } from '../../../../shared/shared.module';
// import { BarfitterAdminModule } from '../../../../admin/admin.module';
import { ProductOrderedFUService } from '../../../active-entities/product-ordered-fu.service';
import { addProductRoute, AddProductPopupService, ProductOrderedResolvePagingParams, AddProductComponent } from './';

const ENTITY_STATES = [
  //    ...addProductPopupRoute,
  ...addProductRoute
];

@NgModule({
  imports: [
    BarfitterSharedModule,
    // BarfitterAdminModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [AddProductComponent],
  entryComponents: [AddProductComponent],
  providers: [AddProductComponent, ProductOrderedFUService, AddProductPopupService, ProductOrderedResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterAddProductModule {}
