import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { OrderedProductStatusComponent } from './ordered-product-status.component';
import { OrderedProductStatusDetailComponent } from './ordered-product-status-detail.component';
import { OrderedProductStatusUpdateComponent } from './ordered-product-status-update.component';
import {
  OrderedProductStatusDeletePopupComponent,
  OrderedProductStatusDeleteDialogComponent
} from './ordered-product-status-delete-dialog.component';
import { orderedProductStatusRoute, orderedProductStatusPopupRoute } from './ordered-product-status.route';

const ENTITY_STATES = [...orderedProductStatusRoute, ...orderedProductStatusPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    OrderedProductStatusComponent,
    OrderedProductStatusDetailComponent,
    OrderedProductStatusUpdateComponent,
    OrderedProductStatusDeleteDialogComponent,
    OrderedProductStatusDeletePopupComponent
  ],
  entryComponents: [OrderedProductStatusDeleteDialogComponent]
})
export class BarfitterOrderedProductStatusModule {}
