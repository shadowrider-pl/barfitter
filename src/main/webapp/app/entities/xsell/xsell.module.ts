import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { XsellComponent } from './xsell.component';
import { XsellDetailComponent } from './xsell-detail.component';
import { XsellUpdateComponent } from './xsell-update.component';
import { XsellDeletePopupComponent, XsellDeleteDialogComponent } from './xsell-delete-dialog.component';
import { xsellRoute, xsellPopupRoute } from './xsell.route';

const ENTITY_STATES = [...xsellRoute, ...xsellPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [XsellComponent, XsellDetailComponent, XsellUpdateComponent, XsellDeleteDialogComponent, XsellDeletePopupComponent],
  entryComponents: [XsellDeleteDialogComponent]
})
export class BarfitterXsellModule {}
