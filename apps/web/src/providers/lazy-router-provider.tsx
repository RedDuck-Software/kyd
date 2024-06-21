import { memo, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/router';

export const LazyRouterProvider = memo(() => {
  return (
    <Suspense fallback={<div />}>
      <RouterProvider router={router} />
    </Suspense>
  );
});
LazyRouterProvider.displayName = 'LazyRouterProvider';
