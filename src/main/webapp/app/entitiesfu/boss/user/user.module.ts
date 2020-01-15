import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  UserFUService,
  UserPopupService,
  UserComponent,
  UserDialogComponent,
  UserPopupComponent,
  UserDeletePopupComponent,
  UserDeleteDialogComponent,
  userRoute,
  userPopupRoute
} from './';
import { ChangePasswordComponent } from './change-password.component';
import { PasswordStrengthBarComponent } from './password-strength-bar.component';

const ENTITY_STATES = [...userRoute, ...userPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    UserComponent,
    UserDialogComponent,
    UserDeleteDialogComponent,
    UserPopupComponent,
    UserDeletePopupComponent,
    PasswordStrengthBarComponent,
    ChangePasswordComponent
  ],
  entryComponents: [
    UserComponent,
    UserDialogComponent,
    UserPopupComponent,
    UserDeleteDialogComponent,
    UserDeletePopupComponent,
    ChangePasswordComponent
  ],
  providers: [UserFUService, UserPopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterUserModule {}
