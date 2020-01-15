import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../shared/shared.module';

import { PANEL_ROUTE, PanelComponent } from './';

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild([PANEL_ROUTE])],
  declarations: [PanelComponent],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterPanelModule {}
