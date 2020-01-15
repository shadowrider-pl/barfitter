import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';

import { TERMS_ROUTE, TermsAndConditionsComponent } from './';

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forRoot([TERMS_ROUTE], { useHash: true })],
  declarations: [TermsAndConditionsComponent],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterAppTermsAndConditionsModule {}
