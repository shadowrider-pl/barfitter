import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  TodaysOrdersService,
  TodaysOrdersPopupService,
  TodaysOrdersComponent,
  TodaysOrdersDetailComponent,
  TodaysOrdersDialogComponent,
  TodaysOrdersPopupComponent,
  TodaysOrdersProductComponent,
  TodaysOrdersProductPopupComponent,
  todaysOrdersRoute,
  todaysOrdersPopupRoute
} from './';

const ENTITY_STATES = [...todaysOrdersRoute, ...todaysOrdersPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TodaysOrdersComponent,
    TodaysOrdersDetailComponent,
    TodaysOrdersDialogComponent,
    TodaysOrdersProductComponent,
    TodaysOrdersProductPopupComponent,
    TodaysOrdersPopupComponent
  ],
  entryComponents: [
    TodaysOrdersComponent,
    TodaysOrdersDialogComponent,
    TodaysOrdersPopupComponent,
    TodaysOrdersProductPopupComponent,
    TodaysOrdersProductComponent
  ],
  providers: [TodaysOrdersService, TodaysOrdersPopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterTodaysOrdersModule {}
