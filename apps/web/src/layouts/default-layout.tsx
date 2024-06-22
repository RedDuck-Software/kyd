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
        <img
          src="/images/top-bg.png"
          className="-z-10 w-full absolute top-0 sm:-top-[8vw] lg:-top-[12vw] left-0"
          alt=""
        />
        <img
          src="/images/bottom-bg.png"
          className="-z-10 lg:w-full absolute bottom-0 sm:-bottom-[8vw] lg:-bottom-[12vw] left-0"
          alt=""
        />
        <div className="min-h-screen  flex flex-1 max-w-[1375px] mx-auto flex-col px-2 sm:px-4">
          <Header />
          <main className="flex-1 py-24">
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
