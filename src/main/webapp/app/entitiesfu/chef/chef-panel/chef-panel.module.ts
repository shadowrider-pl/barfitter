import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';

import { CHEF_PANEL_ROUTE, ChefPanelComponent } from './';

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild([CHEF_PANEL_ROUTE])],
  declarations: [ChefPanelComponent],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterChefPanelModule {}
