import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  ProductDeliveredService,
  ProductDeliveredPopupService,
  ProductDeliveredComponent,
  ProductDeliveredDetailComponent,
  ProductDeliveredDialogComponent,
  ProductDeliveredPopupComponent,
  ProductDeliveredDeletePopupComponent,
  ProductDeliveredDeleteDialogComponent,
  productDeliveredRoute,
  productDeliveredPopupRoute,
  ProductDeliveredResolvePagingParams
} from './';
import { ActiveProductService } from '../../active-entities/active-product.service';
import { ActiveReadyProductService } from '../../active-entities/active-ready-product.service';
import { ActiveCategoryService } from '../../active-entities/active-category.service';
import { ActiveVatService } from '../../active-entities/active-vat.service';

const ENTITY_STATES = [...productDeliveredRoute, ...productDeliveredPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ProductDeliveredComponent,
    ProductDeliveredDetailComponent,
    ProductDeliveredDialogComponent,
    ProductDeliveredDeleteDialogComponent,
    ProductDeliveredPopupComponent,
    ProductDeliveredDeletePopupComponent
  ],
  entryComponents: [
    ProductDeliveredComponent,
    ProductDeliveredDialogComponent,
    ProductDeliveredPopupComponent,
    ProductDeliveredDeleteDialogComponent,
    ProductDeliveredDeletePopupComponent
  ],
  providers: [
    ProductDeliveredService,
    ProductDeliveredPopupService,
    ProductDeliveredResolvePagingParams,
    ActiveProductService,
    ActiveCategoryService,
    ActiveVatService,
    ActiveReadyProductService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterProductDeliveredModule {}
