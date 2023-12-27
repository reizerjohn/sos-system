/* eslint-disable max-len */
'use client';

import GradesTable from '@app/components/grades';
import { useAppContext } from '@app/contexts/app-context';
import { useEffect } from 'react';
import FieldDynamicSelect from '../../components/fields/dynamic-select';
import { useStudentGradesContext } from '@app/contexts/student-grades-context';

const GradesPage = () => {
  const { user, fetchUserData, schoolYear } = useAppContext();
  const { setSchoolYear } = useStudentGradesContext();

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    user && (
      <div className='flex flex-row grow'>
        <div className='flex flex-col mx-10 w-full'>
          <div className='flex flex-row'>
            <div className='w-4/6'>
              <h2 className='text-3xl text-brand-cyan-300'>Transcript of Academic Records</h2>
              <span className='text-xs uppercase text-gray-700 font-bold mt-2'>Student Account Information</span>
            </div>
            <div className='flex flex-row w-2/6 justify-end space-x-2 items-center'>
              <h2 className='pl-1'>School Year</h2>
              <FieldDynamicSelect fetchUrl={'options/school-year'} initialValue={schoolYear} onChange={setSchoolYear} />
            </div>
          </div>
          <div className='flex flex-col mt-2 mb-2'>
            <div className='flex flex-row bg-gray-50'>
              <span className='w-2/5 p-1 px-2 border border-gray-300 bg-gray-200'>LRN / ID Number</span>
              <span className='w-full p-1 px-2 border border-gray-300 text-brand-cyan-300 font-bold'>
                {user.idNumber}
              </span>
            </div>
            <div className='flex flex-row bg-gray-50'>
              <span className='w-2/5 p-1 px-2 border border-gray-300 bg-gray-200'>Student Account Name</span>
              <span className='w-full p-1 px-2 border border-gray-300 text-brand-cyan-300 font-bold'>{`${user.lastName}, ${user.firstName} ${user.middleName}`}</span>
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='flex flex-row bg-gray-50'>
              <span className='w-2/5 p-1 px-2 border border-gray-300 bg-gray-200'>Grade Level</span>
              {user.class ? (
                <span className='w-full p-1 px-2 border border-gray-300 text-brand-cyan-300 font-bold'>
                  {user.class?.gradeLevel}
                </span>
              ) : (
                <span className='w-full p-1 px-2 border border-gray-300 text-brand-cyan-300 font-light italic text-gray-600'>
                  Not enrolled in a class
                </span>
              )}
            </div>
            <div className='flex flex-row bg-gray-50'>
              <span className='w-2/5 p-1 px-2 border border-gray-300 bg-gray-200'>Section</span>
              <span className='w-full p-1 px-2 border border-gray-300 text-brand-cyan-300 font-bold'>
                {user.class?.section}
              </span>
            </div>
            <div className='flex flex-row bg-gray-50'>
              <span className='w-2/5 p-1 px-2 border border-gray-300 bg-gray-200'>Adviser</span>
              <span className='w-full p-1 px-2 border border-gray-300 text-brand-cyan-300 font-bold'>
                {user.class?.adviser}
              </span>
            </div>
          </div>
          <span className='text-xs uppercase text-gray-700 font-bold mt-5 mb-1'>Transcript of Academic Records</span>
          <GradesTable />
        </div>
      </div>
    )
  );
};

export default GradesPage;
