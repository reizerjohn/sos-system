/* eslint-disable max-len */
'use client';

import { useAppContext } from '@app/contexts/app-context';
import FieldDynamicSelect, { FieldDynamicSelectRef, OptionType } from '../../components/fields/dynamic-select';
import { useRef, useState } from 'react';
import { clientApi } from '@app/lib/api';
import { toast } from 'react-toastify';
import Button from '@app/components/buttons/base';

const SettingsPage = () => {
  const { schoolYear, isLoading, setIsLoading, fetchActiveSchoolYear } = useAppContext();
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<OptionType | null>(null);
  const [newSchoolYear, setNewSchoolYear] = useState(null);
  const inputRef = useRef(null);
  const dynamicFieldRef = useRef<FieldDynamicSelectRef>(null);

  const handleCreateNewSchoolYear = async () => {
    setIsLoading(true);

    try {
      const res = await clientApi.post('settings/school-year', { schoolYear: newSchoolYear });

      if (inputRef) {
        inputRef.current.value = '';
      }

      toast.success(res.data.message, {
        position: 'top-center',
      });

      dynamicFieldRef.current?.reset();
    } catch (error) {
      console.error(error);

      toast.error(error.response.data.message, {
        position: 'top-center',
      });
    }

    setIsLoading(false);
  };

  const handleUpdateSchoolYear = async () => {
    setIsLoading(true);

    try {
      const res = await clientApi.put('settings/school-year', { schoolYear: selectedSchoolYear.value });

      if (res?.data?.error) {
        toast.error('Please check the following...', {
          position: 'top-center',
        });
      }

      await fetchActiveSchoolYear();

      toast.success(res.data.message, {
        position: 'top-center',
      });
    } catch (error) {
      console.error(error);

      toast.error('Something went wrong', {
        position: 'top-center',
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <h1 className='text-center text-3xl mb-8'>Settings</h1>
      <div
        onSubmit={handleUpdateSchoolYear}
        className='flex flex-col justify-center items-center border-2 border-gray-300 px-20 py-10 mx-72 rounded-lg mb-5'
      >
        <h1 className='text-gray-600 font-semibold pb-4'>Select Active School Year</h1>
        <FieldDynamicSelect
          className='w-2/3 mb-3'
          fetchUrl={'options/school-year'}
          initialValue={schoolYear}
          onChange={setSelectedSchoolYear}
          ref={dynamicFieldRef}
        />

        <Button
          className='w-2/3 border-gray-300 capitalize'
          type='button'
          radiusSize='lg'
          disabled={isLoading}
          onClick={handleUpdateSchoolYear}
        >
          {isLoading ? 'Please wait...' : `Save`}
        </Button>
      </div>
      <div
        onSubmit={handleCreateNewSchoolYear}
        className='flex flex-col justify-center items-center border-2 border-gray-300 px-20 py-10 mx-72 rounded-lg'
      >
        <h1 className='text-gray-600 font-semibold pb-4'>Create New School Year</h1>
        <input
          name='newSchoolYear'
          type='text'
          required
          ref={inputRef}
          onChange={(e) => setNewSchoolYear(e.target.value)}
          className='w-2/3 rounded-md py-2 px-3 ring-1 mb-3 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
        />
        <Button
          className='w-2/3 border-gray-300 capitalize'
          type='submit'
          radiusSize='lg'
          disabled={isLoading}
          onClick={handleCreateNewSchoolYear}
        >
          {isLoading ? 'Please wait...' : `Create`}
        </Button>
      </div>
    </>
  );
};

export default SettingsPage;
