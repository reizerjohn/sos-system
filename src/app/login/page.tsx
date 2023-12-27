/* eslint-disable max-len */
'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { HOME_PAGE } from '@app/constants/routes';
import Image from 'next/image';
import Button from '@app/components/buttons/base';

const LoginPage = () => {
  const { data: session } = useSession();

  // Redirect to home page if already authenticated
  if (session) {
    redirect(HOME_PAGE);
  }

  // Using react hooks
  // Reference: https://www.w3schools.com/react/react_hooks.asp
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // form submit handler function for button onclick
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Codes is warped in try-catch function to catch unhandled errors
    try {
      // Initiate sign in and pass id number and code parameters
      // Set redirect to false to avoid page redirect on invalid login
      const response = await signIn('credentials', {
        idNumber,
        password,
        redirect: false,
      });

      // Toast is a pop up notification message
      if (response?.error) {
        toast.error('Invalid credentials', {
          position: 'top-center',
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className={`bg-[url('/images/st-roberts-bg.png')] bg-cover`}>
      <div className='flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0 z-10 backdrop-blur-sm backdrop-brightness-75'>
        <a href='#' className='flex justify-center items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'>
          <Image
            src={'/images/st-roberts-logo.png'}
            alt="St. Robert's Logo"
            width={80}
            height={20}
            className='object-contain bg'
          />
          <span className='text-white'>Student Online Services</span>
        </a>
        <div className='w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-brand-color drop-shadow-md'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-white md:text-2xl'>
              Sign in to your account
            </h1>
            <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6' action='#'>
              <div>
                <label htmlFor='idNumber' className='block mb-2 text-md font-medium text-white'>
                  ID Number
                </label>
                <input
                  name='idNumber'
                  onChange={(e) => setIdNumber(e.target.value)}
                  required
                  value={idNumber}
                  type='text'
                  className='text-black sm:text-md rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-700'
                  placeholder='Enter ID number'
                />
              </div>
              <div>
                <label htmlFor='code' className='block mb-2 text-md font-medium text-white'>
                  Password
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  value={password}
                  type='password'
                  className='text-black sm:text-md rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-700'
                  placeholder='Enter password'
                />
              </div>
              <Button className='w-full border-gray-600' type='submit' radiusSize='lg' disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
