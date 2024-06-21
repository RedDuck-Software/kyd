import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { Modals } from '@/components/modals/modals';
import { PageLoader } from '@/components/page-loader/page-loader';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/providers/Providers';
import { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';

const DefaultLayout = memo(() => {
  return (
    <Providers>
      <div className="min-h-screen flex px-4 flex-1 max-w-[1375px] mx-auto flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<PageLoader screen />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        <Toaster />
        <Modals />
      </div>
    </Providers>
  );
});
DefaultLayout.displayName = 'DefaultLayout';

export default DefaultLayout;
