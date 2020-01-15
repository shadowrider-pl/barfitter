import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';

import { PRIVACY_ROUTE, PrivacyComponent } from './';

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forRoot([PRIVACY_ROUTE], { useHash: true })],
  declarations: [PrivacyComponent],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterPrivacyModule {}
