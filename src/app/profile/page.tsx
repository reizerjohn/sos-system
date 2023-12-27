/* eslint-disable max-len */
'use client';
'use client';

import Button from '@app/components/buttons/base';
import LoadingThreeDots from '@app/components/loading/three-dots';
import { clientApi } from '@app/lib/api';
import { omit } from 'lodash';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let createUserData: any = {};

      const formData = new FormData(event.target as any);
      formData.forEach((value, key) => (createUserData[key] = value));

      if (createUserData.password !== createUserData.confirmPassword) {
        toast.error('Password does not match', {
          position: 'top-center',
        });

        setIsLoading(false);
        return;
      }

      createUserData = omit(createUserData, 'confirmPassword');

      const res = await clientApi.put('auth/me', { ...createUserData });

      if (res?.data?.error) {
        toast.error('Please check the following...', {
          position: 'top-center',
        });
      }

      toast.success(res.data.message, {
        position: 'top-center',
      });
    } catch (error) {
      console.error(error);

      if (error.code === 'ERR_BAD_REQUEST') {
        toast.error(error.response?.data?.message, {
          position: 'top-center',
        });
      } else {
        toast.error('Something went wrong', {
          position: 'top-center',
        });
      }
    }

    setIsLoading(false);
  };

  const fetchUserData = async () => {
    setIsLoading(true);

    const { data } = await clientApi.get('auth/me');
    setUser(data);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingThreeDots />
      ) : (
        user && (
          <div className='flex flex-col'>
            <div className='flex justify-center'>
              <h1 className='text-3xl font-semibold capitalize'>Edit User Profile</h1>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-row mt-5 mb-10 mx-52 flex-wrap'>
              <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
                <label htmlFor='idNumber' className='text-slate-800'>
                  LRN / ID Number
                </label>
                <input
                  name='idNumber'
                  type='text'
                  required
                  defaultValue={user.idNumber}
                  disabled
                  className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
                />
              </div>
              <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
                <label htmlFor='lastName' className='text-slate-800'>
                  Last Name
                </label>
                <input
                  name='lastName'
                  type='text'
                  required
                  defaultValue={user.lastName}
                  disabled
                  className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
                />
              </div>
              <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
                <label htmlFor='firstName' className='text-slate-800'>
                  First Name
                </label>
                <input
                  name='firstName'
                  type='text'
                  required
                  defaultValue={user.firstName}
                  disabled
                  className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
                />
              </div>
              <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
                <label htmlFor='middleName' className='text-slate-800'>
                  Middle Name
                </label>
                <input
                  name='middleName'
                  type='text'
                  defaultValue={user.middleName}
                  disabled
                  className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
                />
              </div>
              <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
                <label htmlFor='password' className='text-slate-800'>
                  Password
                </label>
                <input
                  name='password'
                  type='password'
                  required
                  className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
                />
              </div>
              <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
                <label htmlFor='confirmPassword' className='text-slate-800'>
                  Confirm Password
                </label>
                <input
                  name='confirmPassword'
                  type='password'
                  required
                  className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
                />
              </div>

              <div className='flex flex-col w-full px-3 my-3'>
                <Button
                  className='w-full border-gray-300 capitalize'
                  type='submit'
                  radiusSize='lg'
                  disabled={isLoading}
                >
                  Save changes
                </Button>
              </div>
            </form>
          </div>
        )
      )}
      ;
    </>
  );
};

export default ProfilePage;
