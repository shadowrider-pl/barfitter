import { Route } from '@angular/router';

import { PanelComponent } from './';

export const PANEL_ROUTE: Route = {
  path: 'panel',
  component: PanelComponent,
  data: {
    authorities: ['ROLE_BARMAN', 'ROLE_MANAGER'],
    pageTitle: 'global.menu.panel'
  }
};
