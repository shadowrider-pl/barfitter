import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { UserToRestaurantComponent } from './user-to-restaurant.component';
import { UserToRestaurantDetailComponent } from './user-to-restaurant-detail.component';
import { UserToRestaurantUpdateComponent } from './user-to-restaurant-update.component';
import { UserToRestaurantDeletePopupComponent, UserToRestaurantDeleteDialogComponent } from './user-to-restaurant-delete-dialog.component';
import { userToRestaurantRoute, userToRestaurantPopupRoute } from './user-to-restaurant.route';

const ENTITY_STATES = [...userToRestaurantRoute, ...userToRestaurantPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    UserToRestaurantComponent,
    UserToRestaurantDetailComponent,
    UserToRestaurantUpdateComponent,
    UserToRestaurantDeleteDialogComponent,
    UserToRestaurantDeletePopupComponent
  ],
  entryComponents: [UserToRestaurantDeleteDialogComponent]
})
export class BarfitterUserToRestaurantModule {}
