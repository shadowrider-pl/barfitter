import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { ProductOrderedComponent } from './product-ordered.component';
import { ProductOrderedDetailComponent } from './product-ordered-detail.component';
import { ProductOrderedUpdateComponent } from './product-ordered-update.component';
import { ProductOrderedDeletePopupComponent, ProductOrderedDeleteDialogComponent } from './product-ordered-delete-dialog.component';
import { productOrderedRoute, productOrderedPopupRoute } from './product-ordered.route';

const ENTITY_STATES = [...productOrderedRoute, ...productOrderedPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ProductOrderedComponent,
    ProductOrderedDetailComponent,
    ProductOrderedUpdateComponent,
    ProductOrderedDeleteDialogComponent,
    ProductOrderedDeletePopupComponent
  ],
  entryComponents: [ProductOrderedDeleteDialogComponent]
})
export class BarfitterProductOrderedModule {}
