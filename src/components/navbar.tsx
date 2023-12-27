'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { navbarLinks } from '@app/constants/defaults';
import Button from './buttons/base';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROFILE_PAGE } from '@app/constants/routes';

// Display authenticated user on navbar
const AccountSession = () => {
  const { data: session } = useSession();
  const { firstName, lastName, middleName, idNumber } = session.user;

  const router = useRouter();

  return (
    <div className='grid'>
      <span className='label-lg text-white'>{`${lastName}, ${firstName} ${middleName}`}</span>
      <span className='text-sm font-semibold text-gray-100 pb-1'>ID Number: {idNumber}</span>
      <Button
        className='border-gray-600 mb-1'
        onClick={() => router.push(PROFILE_PAGE)}
        type='submit'
        fontSize='xs'
        paddingSize='sm'
        radiusSize='md'
        color='secondary'
      >
        Edit Profile
      </Button>
      <Button
        className='border-gray-600'
        onClick={() => signOut()}
        type='submit'
        fontSize='xs'
        paddingSize='sm'
        radiusSize='md'
      >
        Logout
      </Button>
    </div>
  );
};

const Navbar = () => {
  // Get session object
  const { data: session } = useSession();
  const [navLinks, setNavLinks] = useState(undefined);

  const getUserNavLinks = () => {
    const userNavLinks = navbarLinks.find((l) => l.userType === session.user.type);
    setNavLinks(userNavLinks.links);
  };

  useEffect(() => {
    if (session?.user) {
      getUserNavLinks();
    }
  }, [session]);

  // If user is authenticated, it will display AccountSession
  // Else will display 'Student Account Login' on navbar
  return (
    <header className='w-full z-10 drop-shadow-md'>
      <nav className='bg-brand-color'>
        <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl py-4 px-5'>
          <div className='flex flex-row items-center'>
            <Link href={'/'} key='nav-logo' className='flex justify-center'>
              <Image
                src={'/images/st-roberts-logo.png'}
                alt="St. Robert's Logo"
                width={110}
                height={20}
                className='object-contain bg'
              />
            </Link>
            <div className='h5-semibold text-white pl-5'>
              Student Online Services
              <div className='text-[13px] font-extralight text-gray-100'>{`St. Robert's International College`}</div>
            </div>
          </div>
          <div className='flex items-center'>
            {session ? (
              <AccountSession />
            ) : (
              <>
                <span className='label-lg text-gray-100'>Student Account Login</span>
              </>
            )}
          </div>
        </div>
      </nav>
      <nav className='bg-gray-700'>
        <div className='max-w-screen-xl px-5 mx-auto'>
          <div className='flex items-center'>
            <ul className='flex flex-row font-medium mt-0 text-sm'>
              {navLinks &&
                navLinks.map((link, i) => (
                  <Link
                    key={`navLink${i}`}
                    href={link.url}
                    className='text-white hover:bg-gray-500 py-3 px-5 font-extralight'
                    aria-current='page'
                  >
                    <span>{link.title}</span>
                  </Link>
                ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
