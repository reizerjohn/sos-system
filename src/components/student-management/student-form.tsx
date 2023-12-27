'use client';

import { clientApi } from '@app/lib/api';
import Button from '../buttons/base';
import { FormEvent, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';
import { useAppContext } from '@app/contexts/app-context';
import { useSession } from 'next-auth/react';

/* eslint-disable max-len */
interface Props {
  formType: 'add' | 'edit';
  studentId?: string;
}

const StudentForm = ({ formType, studentId }: Props) => {
  const { data: session } = useSession();
  const { isLoading, setIsLoading } = useAppContext();
  const [studentData, setStudentData] = useState(null);

  const router = useRouter();
  const isAdmin = session.user.type === 'administrator';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let createStudentData = {};

      const formData = new FormData(event.target as any);
      formData.forEach((value, key) => (createStudentData[key] = value));

      let res = undefined;

      if (formType === 'add') {
        res = await clientApi.post('users/students', { ...createStudentData });
      } else if (formType === 'edit') {
        res = await clientApi.put('users/students', { ...createStudentData, studentId });
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

  const fetchStudent = async () => {
    let { data } = await clientApi.get('users/students?studentId=' + studentId);

    const birthday = format(new Date(data.student.birthday), 'yyyy-MM-dd');
    const dateEnrolled = format(new Date(data.student.dateEnrolled), 'yyyy-MM-dd');

    setStudentData({ ...data, student: { ...data.student, birthday, dateEnrolled } });
  };

  useEffect(() => {
    if (formType === 'edit' && studentId) {
      fetchStudent();
    }
  }, []);

  if (!isLoading && (formType === 'add' || (formType === 'edit' && studentData))) {
    return (
      <div className='flex flex-col'>
        <div className='flex justify-center'>
          <h1 className='text-3xl font-semibold capitalize'>
            {formType === 'add' ? `Add New Student` : `Edit Student`}
          </h1>
        </div>
        <div className='flex mx-52 px-3 justify-between'>
          <Button
            className='capitalize text-sm'
            type='button'
            radiusSize='lg'
            color='secondary'
            onClick={() => router.back()}
          >
            <Icon path={mdiArrowLeft} size={0.8} />
            &nbsp;Back to Students List
          </Button>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-row mt-5 mb-10 mx-52 flex-wrap'>
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='idNumber' className='text-slate-800'>
              LRN
            </label>
            <input
              name='idNumber'
              type='text'
              defaultValue={formType === 'edit' ? studentData.idNumber : ''}
              required
              className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
              disabled={!isAdmin}
            />
          </div>
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='lastName' className='text-slate-800'>
              Last Name
            </label>
            <input
              name='lastName'
              type='text'
              defaultValue={formType === 'edit' ? studentData.lastName : ''}
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
              defaultValue={formType === 'edit' ? studentData.firstName : ''}
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
              defaultValue={formType === 'edit' ? studentData.middleName : ''}
              required
              className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
            />
          </div>
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='gender' className='text-slate-800'>
              Gender
            </label>
            <input
              name='gender'
              type='text'
              defaultValue={formType === 'edit' ? studentData.student.gender : ''}
              required
              className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
            />
          </div>
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='birthday' className='text-slate-800'>
              Birthday
            </label>
            <input
              name='birthday'
              type='date'
              defaultValue={formType === 'edit' ? studentData.student.birthday : ''}
              required
              className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
            />
          </div>
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='address' className='text-slate-800'>
              Address
            </label>
            <input
              name='address'
              type='text'
              defaultValue={formType === 'edit' ? studentData.student.address : ''}
              required
              className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
            />
          </div>
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='guardian' className='text-slate-800'>
              Guardian
            </label>
            <input
              name='guardian'
              type='text'
              defaultValue={formType === 'edit' ? studentData.student.guardian : ''}
              required
              className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
            />
          </div>
          {formType === 'edit' && (
            <>
              <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
                <label htmlFor='gradeLevel' className='text-slate-800'>
                  Grade Level
                </label>
                <input
                  name='gradeLevel'
                  type='text'
                  defaultValue={formType === 'edit' ? studentData.class?.gradeLevel : ''}
                  required
                  disabled={true}
                  className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
                />
              </div>
              <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
                <label htmlFor='section' className='text-slate-800'>
                  Section
                </label>
                <input
                  name='section'
                  type='text'
                  defaultValue={formType === 'edit' ? studentData.class?.section : ''}
                  required
                  disabled={true}
                  className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
                />
              </div>
            </>
          )}
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='dateEnrolled' className='text-slate-800'>
              Date Enrolled
            </label>
            <input
              name='dateEnrolled'
              type='date'
              defaultValue={formType === 'edit' ? studentData.student.dateEnrolled : ''}
              required
              className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
              disabled={!isAdmin}
            />
          </div>
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='status' className='text-slate-800'>
              Status
            </label>
            <input
              name='status'
              type='text'
              defaultValue={formType === 'edit' ? studentData.student.status : ''}
              required
              className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
              disabled={!isAdmin}
            />
          </div>

          <div className='flex flex-col w-full px-3 my-3'>
            <Button className='w-full border-gray-300 capitalize' type='submit' radiusSize='lg' disabled={isLoading}>
              {isLoading ? 'Please wait...' : formType === 'add' ? `Add Student` : `Save changes`}
            </Button>
          </div>
        </form>
      </div>
    );
  }
};

export default StudentForm;
