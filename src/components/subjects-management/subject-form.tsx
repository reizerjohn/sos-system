/* eslint-disable max-len */
'use client';

import { clientApi } from '@app/lib/api';
import Button from '../buttons/base';
import { FormEvent, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';
import { useAppContext } from '@app/contexts/app-context';

interface Props {
  formType: 'add' | 'edit';
  subjectId?: number;
}

const SubjectForm = ({ formType, subjectId }: Props) => {
  const { isLoading, setIsLoading } = useAppContext();
  const [subjectName, setSubjectName] = useState(null);

  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let res = undefined;

      if (formType === 'add') {
        res = await clientApi.post('subjects', { subjectName });
      } else if (formType === 'edit') {
        res = await clientApi.put('subjects', { subjectId, subjectName });
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

  const fetchSubject = async () => {
    setIsLoading(true);
    let { data } = await clientApi.get('subjects', { params: { subjectId } });

    setSubjectName(data.name);
    setIsLoading(false);
  };

  useEffect(() => {
    if (formType === 'edit' && subjectId) {
      fetchSubject();
    }
  }, []);

  return (
    <div className='flex flex-col mx-72'>
      <div className='flex justify-center'>
        <h1 className='text-3xl font-semibold capitalize'>Add New Subject</h1>
      </div>
      <div className='flex px-3 justify-between'>
        <Button
          className='capitalize text-sm'
          type='button'
          radiusSize='lg'
          color='secondary'
          onClick={() => router.back()}
        >
          <Icon path={mdiArrowLeft} size={0.8} />
          &nbsp;Back to Subjects
        </Button>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-row mt-5 mb-10 flex-wrap'>
        <div className='flex flex-col w-full space-y-2 px-3 mb-3'>
          <label htmlFor='idNumber' className='text-gray-600 font-semibold text-center'>
            Subject Name
          </label>
          <input
            name='idNumber'
            type='text'
            required
            defaultValue={formType === 'edit' ? subjectName : ''}
            onChange={(e) => setSubjectName(e.target.value)}
            className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-center'
          />
        </div>

        <div className='flex flex-col w-full px-3 my-3'>
          <Button className='w-full border-gray-300 capitalize' type='submit' radiusSize='lg' disabled={isLoading}>
          {isLoading ? 'Please wait...' : formType === 'add' ? `Add Subject` : `Save changes`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubjectForm;
