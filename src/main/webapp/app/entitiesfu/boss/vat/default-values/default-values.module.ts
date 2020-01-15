import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../../shared/shared.module';

import { defaultValuesRoute } from './default-values.route';
import { DefaultValuesComponent } from './default-values.component';

const ENTITY_STATES = [...defaultValuesRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [DefaultValuesComponent],
  entryComponents: [DefaultValuesComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterDefaultValuesModule {}
