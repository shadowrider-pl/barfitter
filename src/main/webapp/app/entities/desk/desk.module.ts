import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { DeskComponent } from './desk.component';
import { DeskDetailComponent } from './desk-detail.component';
import { DeskUpdateComponent } from './desk-update.component';
import { DeskDeletePopupComponent, DeskDeleteDialogComponent } from './desk-delete-dialog.component';
import { deskRoute, deskPopupRoute } from './desk.route';

const ENTITY_STATES = [...deskRoute, ...deskPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [DeskComponent, DeskDetailComponent, DeskUpdateComponent, DeskDeleteDialogComponent, DeskDeletePopupComponent],
  entryComponents: [DeskDeleteDialogComponent]
})
export class BarfitterDeskModule {}
