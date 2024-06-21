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
      <div className="relative overflow-hidden">
        <img src="/images/top-bg.png" className="-z-10 w-full absolute -top-[60px] left-0" alt="" />
        <img src="/images/bottom-bg.png" className="-z-10 w-full absolute -bottom-[60px] left-0" alt="" />
        <div className="min-h-screen  flex flex-1 max-w-[1375px] mx-auto flex-col px-2 sm:px-4">
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
      </div>
    </Providers>
  );
});
DefaultLayout.displayName = 'DefaultLayout';

export default DefaultLayout;
