import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  StockService,
  StockPopupService,
  StockComponent,
  //    StockDetailComponent,
  StockDialogComponent,
  StockPopupComponent,
  StockDeletePopupComponent,
  StockDeleteDialogComponent,
  StockDeleteOutOfStockDialogComponent,
  StockDeleteOutOfStockPopupComponent,
  stockRoute,
  stockPopupRoute
} from './';

const ENTITY_STATES = [...stockRoute, ...stockPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    StockComponent,
    //        StockDetailComponent,
    StockDialogComponent,
    StockDeleteDialogComponent,
    StockPopupComponent,
    StockDeletePopupComponent,
    StockDeleteOutOfStockDialogComponent,
    StockDeleteOutOfStockPopupComponent
  ],
  entryComponents: [
    StockComponent,
    StockDialogComponent,
    StockPopupComponent,
    StockDeleteDialogComponent,
    StockDeletePopupComponent,
    StockDeleteOutOfStockDialogComponent,
    StockDeleteOutOfStockPopupComponent
  ],
  providers: [StockService, StockPopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterStockModule {}
