import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  FavoritesService,
  FavoritesPopupService,
  FavoritesComponent,
  FavoritesDetailComponent,
  FavoritesDialogComponent,
  FavoritesPopupComponent,
  FavoritesDeletePopupComponent,
  FavoritesDeleteDialogComponent,
  favoritesRoute,
  favoritesPopupRoute,
  FavoriteResolvePagingParams
} from './';

const ENTITY_STATES = [...favoritesRoute, ...favoritesPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    FavoritesComponent,
    FavoritesDetailComponent,
    FavoritesDialogComponent,
    FavoritesDeleteDialogComponent,
    FavoritesPopupComponent,
    FavoritesDeletePopupComponent
  ],
  entryComponents: [
    FavoritesComponent,
    FavoritesDialogComponent,
    FavoritesPopupComponent,
    FavoritesDeleteDialogComponent,
    FavoritesDeletePopupComponent
  ],
  providers: [FavoritesService, FavoritesPopupService, FavoriteResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterFavoritesModule {}
