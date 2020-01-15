import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  BossRestaurantService,
  RestaurantPopupService,
  RestaurantDialogComponent,
  RestaurantPopupComponent,
  //    restaurantRoute,
  bossRestaurantPopupRoute
  //    RestaurantResolvePagingParams,
} from './';

const ENTITY_STATES = [
  //    ...restaurantRoute,
  ...bossRestaurantPopupRoute
];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [RestaurantDialogComponent, RestaurantPopupComponent],
  entryComponents: [RestaurantDialogComponent, RestaurantPopupComponent],
  providers: [
    BossRestaurantService,
    RestaurantPopupService
    //        RestaurantResolvePagingParams,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterBossRestaurantModule {}
