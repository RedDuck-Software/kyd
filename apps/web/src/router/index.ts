import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

export const routes = {
  root: '/',
  profile: '/profile',
  create: '/create',
  nft: '/nft',
  auctions: '/auctions/:id',
} as const;

export const router = createBrowserRouter([
  {
    path: routes.root,
    Component: lazy(() => import('@/layouts/default-layout')),
    children: [
      {
        path: routes.root,
        Component: lazy(() => import('@/pages/home')),
      },
      {
        path: routes.create,
        Component: lazy(() => import('@/pages/create-auction')),
      },
      {
        path: routes.nft,
        Component: lazy(() => import('@/pages/nft')),
      },
      {
        path: routes.profile,
        Component: lazy(() => import('@/pages/profile')),
      },
    ],
  },
]);
