import { createBrowserRouter } from 'react-router-dom';

import { adminRoutes } from './router/admin.routes';
import { sharedRoutes } from './router/shared.routes';

export const router = createBrowserRouter([...adminRoutes, ...sharedRoutes]);
