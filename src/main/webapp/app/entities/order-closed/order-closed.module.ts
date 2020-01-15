import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { OrderClosedComponent } from './order-closed.component';
import { OrderClosedDetailComponent } from './order-closed-detail.component';
import { OrderClosedUpdateComponent } from './order-closed-update.component';
import { OrderClosedDeletePopupComponent, OrderClosedDeleteDialogComponent } from './order-closed-delete-dialog.component';
import { orderClosedRoute, orderClosedPopupRoute } from './order-closed.route';

const ENTITY_STATES = [...orderClosedRoute, ...orderClosedPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    OrderClosedComponent,
    OrderClosedDetailComponent,
    OrderClosedUpdateComponent,
    OrderClosedDeleteDialogComponent,
    OrderClosedDeletePopupComponent
  ],
  entryComponents: [OrderClosedDeleteDialogComponent]
})
export class BarfitterOrderClosedModule {}
