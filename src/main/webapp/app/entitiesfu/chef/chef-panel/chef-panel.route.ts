import { Route } from '@angular/router';

import { ChefPanelComponent } from './';

export const CHEF_PANEL_ROUTE: Route = {
  path: 'chef-panel',
  component: ChefPanelComponent,
  data: {
    authorities: ['ROLE_CHEF', 'ROLE_MANAGER'],
    pageTitle: 'global.menu.panel'
  }
};
