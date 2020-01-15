import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';

import { LOGIN_ROUTE, LoginComponent } from './';

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forRoot([LOGIN_ROUTE], { useHash: true })],
  declarations: [LoginComponent],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterLoginModule {}
