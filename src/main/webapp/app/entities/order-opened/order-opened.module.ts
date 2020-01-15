import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { OrderOpenedComponent } from './order-opened.component';
import { OrderOpenedDetailComponent } from './order-opened-detail.component';
import { OrderOpenedUpdateComponent } from './order-opened-update.component';
import { OrderOpenedDeletePopupComponent, OrderOpenedDeleteDialogComponent } from './order-opened-delete-dialog.component';
import { orderOpenedRoute, orderOpenedPopupRoute } from './order-opened.route';

const ENTITY_STATES = [...orderOpenedRoute, ...orderOpenedPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    OrderOpenedComponent,
    OrderOpenedDetailComponent,
    OrderOpenedUpdateComponent,
    OrderOpenedDeleteDialogComponent,
    OrderOpenedDeletePopupComponent
  ],
  entryComponents: [OrderOpenedDeleteDialogComponent]
})
export class BarfitterOrderOpenedModule {}
