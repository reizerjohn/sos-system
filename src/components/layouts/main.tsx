'use client';

import { LOGIN_PAGE } from '@app/constants/routes';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '../navbar';
import Footer from '../footer';
import Loading from '@app/app/loading';

const MainPageLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (pathname !== LOGIN_PAGE) {
    return (
      <>
        <Navbar />
        <div className='w-full grow'>
          <div className='justify-center mx-auto max-w-screen-xl my-10'>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return <>{children}</>;
};

export default MainPageLayout;
