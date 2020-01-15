import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import { CountryService } from '../../active-entities/country.service';

import { RegisterRestaurantComponent } from './register-restaurant.component';
import { accountRestState } from './register-restaurant.route';
import { RegisterRestaurantService } from './register-restaurant.service';

const ENTITY_STATES = [
  ...accountRestState
  //    ...bossRestaurantPopupRoute,
];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [RegisterRestaurantComponent],
  entryComponents: [RegisterRestaurantComponent],
  providers: [
    RegisterRestaurantService,
    CountryService
    //        RestaurantResolvePagingParams,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterRegisterRestaurantModule {}
