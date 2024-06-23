import { Footer } from '@/components/footer/footer';
import { Modals } from '@/components/modals/modals';
import { Header } from '@/components/header';
import { PageLoader } from '@/components/page-loader/page-loader';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/providers/Providers';
import { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';

const DefaultLayout = memo(() => {
  return (
    <Providers>
      <div className="min-h-screen flex flex-1 max-w-[1375px] mx-auto flex-col px-2 sm:px-4">
        <Header />
        <main className="flex-1 pt-8 pb-20">
          <Suspense fallback={<PageLoader screen />}>
            <Outlet />
          </Suspense>
        </main>
        <Toaster />
        <Modals />
      </div>
      <Footer />
    </Providers>
  );
});
DefaultLayout.displayName = 'DefaultLayout';

export default DefaultLayout;
