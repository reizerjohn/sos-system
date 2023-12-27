'use client';

import { clientApi } from '@app/lib/api';
import Button from '../buttons/base';
import { FormEvent, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { omit } from 'lodash';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';

/* eslint-disable max-len */
interface Props {
  formType: 'add' | 'edit';
  userId?: string;
}

const UserForm = ({ formType, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(undefined);

  const router = useRouter();

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

      let res = undefined;

      if (formType === 'add') {
        res = await clientApi.post('users', { ...createUserData });
      } else if (formType === 'edit') {
        res = await clientApi.put('users', { ...createUserData, userId });
      }

      if (res?.data?.error) {
        toast.error('Please check the following...', {
          position: 'top-center',
        });
      }

      toast.success(res.data.message, {
        position: 'top-center',
      });

      router.back();
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

  const fetchUser = async () => {
    setIsLoading(true);
    const { data } = await clientApi.get('users?userId=' + userId);
    setUserData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (formType === 'edit' && userId) {
      fetchUser();
    }
  }, []);

  if ((!isLoading && formType === 'add') || (formType === 'edit' && userData)) {
    return (
      <div className='flex flex-col'>
        <div className='flex justify-center'>
          <h1 className='text-3xl font-semibold capitalize'>
            {formType === 'add' ? `Add New Teacher` : `Edit Teacher`}
          </h1>
        </div>
        <div className='flex mx-52 px-3 justify-start'>
          <Button
            className='capitalize text-sm'
            type='button'
            radiusSize='lg'
            color='secondary'
            onClick={() => router.back()}
          >
            <Icon path={mdiArrowLeft} size={0.8} />
            &nbsp;Back to Teachers List
          </Button>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-row mt-5 mb-10 mx-52 flex-wrap'>
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='idNumber' className='text-slate-800'>
              ID Number
            </label>
            <input
              name='idNumber'
              type='text'
              defaultValue={formType === 'edit' ? userData.idNumber : ''}
              required
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
              defaultValue={formType === 'edit' ? userData.lastName : ''}
              required
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
              defaultValue={formType === 'edit' ? userData.firstName : ''}
              required
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
              defaultValue={formType === 'edit' ? userData.middleName : ''}
              required={formType === 'edit' ? false : true}
              className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
            />
          </div>
          {formType === 'add' && (
            <>
              {' '}
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
            </>
          )}
          <div className='flex flex-col w-full px-3 my-3'>
            <Button className='w-full border-gray-300 capitalize' type='submit' radiusSize='lg' disabled={isLoading}>
              {isLoading ? 'Please wait...' : formType === 'add' ? 'Add Teacher' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    );
  }
};

export default UserForm;
