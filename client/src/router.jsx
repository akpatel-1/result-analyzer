import { createBrowserRouter } from 'react-router-dom';

import { adminRoutes } from './router/admin.routes';
import { hodRoutes } from './router/hod.routes';
import { sharedRoutes } from './router/shared.routes';

export const router = createBrowserRouter([
  ...adminRoutes,
  ...hodRoutes,
  ...sharedRoutes,
]);
