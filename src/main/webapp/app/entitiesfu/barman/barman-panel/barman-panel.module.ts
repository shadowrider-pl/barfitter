import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';

import { BARMAN_PANEL_ROUTE, BarmanPanelComponent } from './';

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild([BARMAN_PANEL_ROUTE])],
  declarations: [BarmanPanelComponent],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterBarmanPanelModule {}
