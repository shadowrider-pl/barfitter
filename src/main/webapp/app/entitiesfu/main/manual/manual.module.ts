import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';

import { MANUAL_ROUTE, ManualComponent } from './';

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forRoot([MANUAL_ROUTE], { useHash: true })],
  declarations: [ManualComponent],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterManualModule {}
