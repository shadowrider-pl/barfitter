import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { ProductDeliveredComponent } from './product-delivered.component';
import { ProductDeliveredDetailComponent } from './product-delivered-detail.component';
import { ProductDeliveredUpdateComponent } from './product-delivered-update.component';
import { ProductDeliveredDeletePopupComponent, ProductDeliveredDeleteDialogComponent } from './product-delivered-delete-dialog.component';
import { productDeliveredRoute, productDeliveredPopupRoute } from './product-delivered.route';

const ENTITY_STATES = [...productDeliveredRoute, ...productDeliveredPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ProductDeliveredComponent,
    ProductDeliveredDetailComponent,
    ProductDeliveredUpdateComponent,
    ProductDeliveredDeleteDialogComponent,
    ProductDeliveredDeletePopupComponent
  ],
  entryComponents: [ProductDeliveredDeleteDialogComponent]
})
export class BarfitterProductDeliveredModule {}
