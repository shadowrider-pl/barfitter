import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../../shared/shared.module';
import { ProductOrderedFUService } from '../../../active-entities/product-ordered-fu.service';
import {
  ProductOrderedPopupService,
  //    ProductOrderedComponent,
  ProductOrderedFUDetailComponent,
  ProductOrderedFUDialogComponent,
  ProductOrderedFUPopupComponent,
  ProductOrderedFUDeletePopupComponent,
  ProductOrderedFUDeleteDialogComponent,
  productOrderedRoute,
  productOrderedPopupRoute,
  ProductOrderedResolvePagingParams
} from './';

const ENTITY_STATES = [...productOrderedRoute, ...productOrderedPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    //        ProductOrderedComponent,
    ProductOrderedFUDetailComponent,
    ProductOrderedFUDialogComponent,
    ProductOrderedFUDeleteDialogComponent,
    ProductOrderedFUPopupComponent,
    ProductOrderedFUDeletePopupComponent
  ],
  entryComponents: [
    //        ProductOrderedComponent,
    ProductOrderedFUDialogComponent,
    ProductOrderedFUPopupComponent,
    ProductOrderedFUDeleteDialogComponent,
    ProductOrderedFUDeletePopupComponent
  ],
  providers: [ProductOrderedFUService, ProductOrderedPopupService, ProductOrderedResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterProductOrderedFUModule {}
