import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { FavoriteComponent } from './favorite.component';
import { FavoriteDetailComponent } from './favorite-detail.component';
import { FavoriteUpdateComponent } from './favorite-update.component';
import { FavoriteDeletePopupComponent, FavoriteDeleteDialogComponent } from './favorite-delete-dialog.component';
import { favoriteRoute, favoritePopupRoute } from './favorite.route';

const ENTITY_STATES = [...favoriteRoute, ...favoritePopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    FavoriteComponent,
    FavoriteDetailComponent,
    FavoriteUpdateComponent,
    FavoriteDeleteDialogComponent,
    FavoriteDeletePopupComponent
  ],
  entryComponents: [FavoriteDeleteDialogComponent]
})
export class BarfitterFavoriteModule {}
