import { createBrowserRouter } from 'react-router-dom';

import { adminRoutes } from './router/admin.routes';
import { deptRoutes } from './router/dept.routes';
import { sharedRoutes } from './router/shared.routes';
import { studentRoutes } from './router/student.routes';

export const router = createBrowserRouter([
  ...adminRoutes,
  ...deptRoutes,
  ...studentRoutes,
  ...sharedRoutes,
]);
