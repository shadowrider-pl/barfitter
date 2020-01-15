import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { ProductOnStockComponent } from './product-on-stock.component';
import { ProductOnStockDetailComponent } from './product-on-stock-detail.component';
import { ProductOnStockUpdateComponent } from './product-on-stock-update.component';
import { ProductOnStockDeletePopupComponent, ProductOnStockDeleteDialogComponent } from './product-on-stock-delete-dialog.component';
import { productOnStockRoute, productOnStockPopupRoute } from './product-on-stock.route';

const ENTITY_STATES = [...productOnStockRoute, ...productOnStockPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ProductOnStockComponent,
    ProductOnStockDetailComponent,
    ProductOnStockUpdateComponent,
    ProductOnStockDeleteDialogComponent,
    ProductOnStockDeletePopupComponent
  ],
  entryComponents: [ProductOnStockDeleteDialogComponent]
})
export class BarfitterProductOnStockModule {}
