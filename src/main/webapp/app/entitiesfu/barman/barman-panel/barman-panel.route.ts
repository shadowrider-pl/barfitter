import { Route } from '@angular/router';

import { BarmanPanelComponent } from './';

export const BARMAN_PANEL_ROUTE: Route = {
  path: 'barman-panel',
  component: BarmanPanelComponent,
  data: {
    authorities: ['ROLE_BARMAN', 'ROLE_MANAGER'],
    pageTitle: 'global.menu.panel'
  }
};
