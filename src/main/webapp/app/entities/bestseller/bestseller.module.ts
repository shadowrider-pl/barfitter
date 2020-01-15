import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { BestsellerComponent } from './bestseller.component';
import { BestsellerDetailComponent } from './bestseller-detail.component';
import { BestsellerUpdateComponent } from './bestseller-update.component';
import { BestsellerDeletePopupComponent, BestsellerDeleteDialogComponent } from './bestseller-delete-dialog.component';
import { bestsellerRoute, bestsellerPopupRoute } from './bestseller.route';

const ENTITY_STATES = [...bestsellerRoute, ...bestsellerPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    BestsellerComponent,
    BestsellerDetailComponent,
    BestsellerUpdateComponent,
    BestsellerDeleteDialogComponent,
    BestsellerDeletePopupComponent
  ],
  entryComponents: [BestsellerDeleteDialogComponent]
})
export class BarfitterBestsellerModule {}
