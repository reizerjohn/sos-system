/* eslint-disable max-len */
'use client';

import Button from '../buttons/base';
import { FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { clientApi } from '@app/lib/api';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';
import { useStudentGradesContext } from '@app/contexts/student-grades-context';
import { useAppContext } from '@app/contexts/app-context';
import StudentGradesTable from './grades-table';

interface Props {
  studentId: string;
  classId: string;
}

const EditStudentGradesForm = ({ studentId, classId }: Props) => {
  const { isLoading, setIsLoading } = useAppContext();
  const { grades, fetchStudentGrades } = useStudentGradesContext();

  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let res = undefined;

      res = await clientApi.post('users/students/grades', {
        data: { classId: +classId, studentId: +studentId, grades },
      });

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

  useEffect(() => {
    fetchStudentGrades({ studentId: +studentId, classId: +classId });
  }, []);

  return (
    <div className='flex flex-col'>
      <div className='flex justify-center'>
        <h1 className='text-3xl font-semibold capitalize'>Edit Student Grades</h1>
      </div>
      <div className='flex mx-44 px-3 justify-start'>
        <Button
          className='capitalize text-sm'
          type='button'
          radiusSize='lg'
          color='secondary'
          onClick={() => router.back()}
        >
          <Icon path={mdiArrowLeft} size={0.8} />
          &nbsp;Back to Student
        </Button>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col mt-5 px-3 mx-44'>
        <table className='w-full border border-gray-300'>
          <thead className=''>
            <tr>
              <th rowSpan={2} className='w-4/1 border border-gray-300'>
                Subjects
              </th>
              <th colSpan={4} className='w-4/12 border border-gray-300'>
                Quarter
              </th>
              <th rowSpan={2} className='w-2/12 border border-gray-300'>
                Final Grade
              </th>
              <th rowSpan={2} className='w-2/12 border border-gray-300'>
                REMARKS
              </th>
            </tr>
            <tr>
              <th className='border border-gray-300'>1</th>
              <th className='border border-gray-300'>2</th>
              <th className='border border-gray-300'>3</th>
              <th className='border border-gray-300'>4</th>
            </tr>
          </thead>
          <tbody>
            <StudentGradesTable />
          </tbody>
        </table>

        <div className='flex flex-col w-full my-3 mt-8'>
          <Button className='w-full border-gray-300 capitalize' type='submit' radiusSize='lg' disabled={isLoading}>
            {isLoading ? 'Please wait...' : `Save changes`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditStudentGradesForm;
