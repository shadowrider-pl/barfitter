import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent]
})
export class BarfitterHomeModule {}

// import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { RouterModule } from '@angular/router';

// import { BarfitterSharedModule } from 'app/shared/shared.module';
// import { HOME_ROUTE, HomeComponent } from './';

// @NgModule({
//     imports: [BarfitterSharedModule, RouterModule.forChild([HOME_ROUTE])],
//     declarations: [HomeComponent],
//     schemas: [CUSTOM_ELEMENTS_SCHEMA]
// })
// export class BarfitterHomeModule {}
