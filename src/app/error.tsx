'use client';

import Button from '@app/components/buttons/base';
import { HOME_PAGE } from '@app/constants/routes';
import { useRouter } from 'next/navigation';

const ErrorPage = () => {
  const router = useRouter();

  return (
    <div className='text-center'>
      <h1 className='h4 font-outfit text-neutral-700 mb-2'>Unauthorized Access</h1>
      <h1 className='text-lg text-neutral-500 mb-5'>Sorry, you do not have access to this page</h1>
      <Button onClick={() => router.push(HOME_PAGE)} radiusSize='lg'>Return to Home Page</Button>
    </div>
  );
};

export default ErrorPage;
