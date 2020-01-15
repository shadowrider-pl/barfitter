import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { RestaurantComponent } from './restaurant.component';
import { RestaurantDetailComponent } from './restaurant-detail.component';
import { RestaurantUpdateComponent } from './restaurant-update.component';
import { RestaurantDeletePopupComponent, RestaurantDeleteDialogComponent } from './restaurant-delete-dialog.component';
import { restaurantRoute, restaurantPopupRoute } from './restaurant.route';

const ENTITY_STATES = [...restaurantRoute, ...restaurantPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RestaurantComponent,
    RestaurantDetailComponent,
    RestaurantUpdateComponent,
    RestaurantDeleteDialogComponent,
    RestaurantDeletePopupComponent
  ],
  entryComponents: [RestaurantDeleteDialogComponent]
})
export class BarfitterRestaurantModule {}
