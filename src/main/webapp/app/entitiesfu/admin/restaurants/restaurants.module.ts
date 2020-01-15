import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  restaurantsPopupRoute,
  restaurantsRoute,
  RestaurantsComponent,
  RestaurantsDeleteDialogComponent,
  RestaurantsDeletePopupComponent,
  RestaurantsPopupService,
  AdminRestaurantsService
} from './';

const ENTITY_STATES = [...restaurantsRoute, ...restaurantsPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [RestaurantsComponent, RestaurantsDeleteDialogComponent, RestaurantsDeletePopupComponent],
  entryComponents: [RestaurantsComponent, RestaurantsDeleteDialogComponent, RestaurantsDeletePopupComponent],
  providers: [
    AdminRestaurantsService,
    RestaurantsPopupService
    //        RestaurantsResolvePagingParams,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterRestaurantsModule {}
