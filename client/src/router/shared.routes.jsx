import Error403 from '../pages/shared/Error403Page';
import Error404 from '../pages/shared/Error404Page';
import Error500 from '../pages/shared/Error500Page';

export const sharedRoutes = [
  { path: 'error/403', element: <Error403 /> },
  { path: 'error/500', element: <Error500 /> },
  { path: '*', element: <Error404 /> },
];
