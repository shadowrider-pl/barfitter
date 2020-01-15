import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
// import {BarfitterAdminModule} from '../../../admin/admin.module';
import {
  MonthlyReportService,
  MonthlyReportComponent,
  MonthlyReportDetailComponent,
  monthlyReportRoute,
  MonthlyReportToDropdownService
  //    substitutesPopupRoute,
} from './';

const ENTITY_STATES = [
  ...monthlyReportRoute
  //    ...substitutesPopupRoute,
];

@NgModule({
  imports: [
    BarfitterSharedModule,
    // BarfitterAdminModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [MonthlyReportComponent, MonthlyReportDetailComponent],
  entryComponents: [MonthlyReportComponent],
  providers: [MonthlyReportService, MonthlyReportToDropdownService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterMonthlyReportModule {}
