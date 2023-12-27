/* eslint-disable max-len */
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { clientApi } from '@app/lib/api';
import { useStudentGradesContext } from '@app/contexts/student-grades-context';
import { useAppContext } from '@app/contexts/app-context';
import StudentGradesTable from '@app/components/student-grades/grades-table';
import Button from '@app/components/buttons/base';
import FieldDynamicSelect, { FieldDynamicSelectRef, OptionType } from '../../../components/fields/dynamic-select';

const StudentsGradingPage = () => {
  const { isLoading, setIsLoading } = useAppContext();
  const { grades, fetchSubjectStudents } = useStudentGradesContext();
  const [subject, setSubject] = useState<OptionType | null>(null);
  const dynamicFieldRef = useRef<FieldDynamicSelectRef>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let res = undefined;

      res = await clientApi.post('users/students/grades', {
        data: { grades },
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
    if (subject) {
      fetchSubjectStudents({ subjectId: subject.value });
    }
  }, [subject]);

  return (
    <div className='flex flex-col mx-44'>
      <div className='flex justify-center mb-5'>
        <h1 className='text-3xl font-semibold capitalize'>Edit Student Grades</h1>
      </div>

      <div className='flex flex-row items-center space-x-2 px-3'>
        <p>Select Subject: </p>
        <FieldDynamicSelect
          fetchUrl={'options/subjects/class'}
          isClearable={true}
          placeholder='Select subject...'
          onChange={setSubject}
          ref={dynamicFieldRef}
          className='grow'
        />
      </div>

      {subject && (
        <form onSubmit={handleSubmit} className='flex flex-col mt-5 px-3'>
          <table className='w-full border border-gray-300'>
            <thead className=''>
              <tr>
                <th rowSpan={2} className='w-4/1 border border-gray-300'>
                  Students
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
      )}
    </div>
  );
};

export default StudentsGradingPage;
