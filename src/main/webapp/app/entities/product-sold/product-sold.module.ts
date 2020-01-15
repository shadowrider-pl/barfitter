import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { ProductSoldComponent } from './product-sold.component';
import { ProductSoldDetailComponent } from './product-sold-detail.component';
import { ProductSoldUpdateComponent } from './product-sold-update.component';
import { ProductSoldDeletePopupComponent, ProductSoldDeleteDialogComponent } from './product-sold-delete-dialog.component';
import { productSoldRoute, productSoldPopupRoute } from './product-sold.route';

const ENTITY_STATES = [...productSoldRoute, ...productSoldPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ProductSoldComponent,
    ProductSoldDetailComponent,
    ProductSoldUpdateComponent,
    ProductSoldDeleteDialogComponent,
    ProductSoldDeletePopupComponent
  ],
  entryComponents: [ProductSoldDeleteDialogComponent]
})
export class BarfitterProductSoldModule {}
