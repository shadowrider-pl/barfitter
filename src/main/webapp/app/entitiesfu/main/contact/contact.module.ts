import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';

import { CONTACT_ROUTE, ContactComponent } from './';

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forRoot([CONTACT_ROUTE], { useHash: true })],
  declarations: [ContactComponent],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterAppContactModule {}
