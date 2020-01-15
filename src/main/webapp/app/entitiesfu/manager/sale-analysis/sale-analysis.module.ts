import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
// import { BarfitterAdminModule } from '../../../admin/admin.module';
import {
  SaleAnalysisService,
  SaleAnalysisComponent,
  saleAnalysisRoute
  //    substitutesPopupRoute,
} from './';

const ENTITY_STATES = [
  ...saleAnalysisRoute
  //    ...substitutesPopupRoute,
];

@NgModule({
  imports: [
    BarfitterSharedModule,
    // BarfitterAdminModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [SaleAnalysisComponent],
  entryComponents: [SaleAnalysisComponent],
  providers: [SaleAnalysisService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterSaleAnalysisModule {}
