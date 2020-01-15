import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
// import { BarfitterAdminModule } from '../../../admin/admin.module';
import { ProductOnStockDistinctService } from '../../active-entities/product-on-stock-distinct.service';
import {
  SubstitutesService,
  SubstitutesPopupService,
  SubstitutesComponent,
  SubstitutesDialogComponent,
  SubstitutesPopupComponent,
  substitutesRoute,
  substitutesPopupRoute
} from './';

const ENTITY_STATES = [...substitutesRoute, ...substitutesPopupRoute];

@NgModule({
  imports: [
    BarfitterSharedModule,
    // BarfitterAdminModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [SubstitutesComponent, SubstitutesDialogComponent, SubstitutesPopupComponent],
  entryComponents: [SubstitutesComponent, SubstitutesDialogComponent, SubstitutesPopupComponent],
  providers: [SubstitutesService, SubstitutesPopupService, ProductOnStockDistinctService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterSubstitutesModule {}
