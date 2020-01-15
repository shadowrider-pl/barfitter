import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  AuthorizationService,
  //    ProductDeliveredPopupService,
  ProductDeliveredComponent,
  //    ProductDeliveredDetailComponent,
  //    ProductDeliveredDialogComponent,
  //    ProductDeliveredPopupComponent,
  //    ProductDeliveredDeletePopupComponent,
  //    ProductDeliveredDeleteDialogComponent,
  productDeliveredRoute,
  //    productDeliveredPopupRoute,
  ProductDeliveredResolvePagingParams
} from './';

const ENTITY_STATES = [
  ...productDeliveredRoute
  //    ...productDeliveredPopupRoute,
];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ProductDeliveredComponent
    //        ProductDeliveredDetailComponent,
    //        ProductDeliveredDialogComponent,
    //        ProductDeliveredDeleteDialogComponent,
    //        ProductDeliveredPopupComponent,
    //        ProductDeliveredDeletePopupComponent,
  ],
  entryComponents: [
    ProductDeliveredComponent
    //        ProductDeliveredDialogComponent,
    //        ProductDeliveredPopupComponent,
    //        ProductDeliveredDeleteDialogComponent,
    //        ProductDeliveredDeletePopupComponent,
  ],
  providers: [
    AuthorizationService,
    //        ProductDeliveredPopupService,
    ProductDeliveredResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterAuthorizationModule {}
