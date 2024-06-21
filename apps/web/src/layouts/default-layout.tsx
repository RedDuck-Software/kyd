import { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';


const DefaultLayout = memo(() => {
  return (

          <Suspense fallback={<div />}>
            <Outlet />
          </Suspense>

  );
});
DefaultLayout.displayName = 'DefaultLayout';

export default DefaultLayout;
