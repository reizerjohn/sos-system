'use client';

import { clientApi } from '@app/lib/api';
import Button from '../buttons/base';
import { FormEvent, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import FieldDynamicSelect, { OptionType } from '../fields/dynamic-select';
import StudentListTable from './student-list-table';
import Icon from '@mdi/react';
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import { useAppContext } from '@app/contexts/app-context';
import { CLASS_PAGE } from '@app/constants/routes';

/* eslint-disable max-len */
interface Props {
  formType: 'add' | 'edit';
  classId?: string;
}

const ClassForm = ({ formType, classId }: Props) => {
  const { schoolYear, isLoading, setIsLoading } = useAppContext();
  const [classData, setClassData] = useState(undefined);
  const [gradeLevelData, setGradeLevelData] = useState<OptionType | null>(null);
  const [adviserData, setAdviserData] = useState<OptionType | null>(null);
  const [studentList, setStudentList] = useState<OptionType[]>([]);

  const router = useRouter();

  const fetchClass = async () => {
    const { data } = await clientApi.get('classes?classId=' + classId);
    setClassData(data);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let createClassData = {};

      const formData = new FormData(event.target as any);
      formData.forEach((value, key) => (createClassData[key] = value));

      let res = undefined;

      const classBodyData = {
        ...createClassData,
        gradeLevel: gradeLevelData?.value,
        adviserId: +adviserData?.value,
        studentIds: studentList.map((s) => s.value),
      };

      if (formType === 'add') {
        res = await clientApi.post('classes', classBodyData);
      } else if (formType === 'edit') {
        res = await clientApi.put('classes', { classId: +classId, ...classBodyData });
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

  useEffect(() => {
    if (formType === 'edit' && classId) {
      fetchClass();
    }
  }, []);

  if (formType === 'add' || (formType === 'edit' && classData)) {
    return (
      <div className='flex flex-col'>
        <div className='flex justify-center'>
          <h1 className='text-3xl font-semibold capitalize'>{formType === 'add' ? `Add New Class` : `Edit Class`}</h1>
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
            &nbsp;Back to Class List
          </Button>
          {formType === 'edit' && (
            <Button
              className=' border-gray-300 capitalize text-sm'
              type='button'
              radiusSize='lg'
              color='secondary'
              onClick={() => router.push(CLASS_PAGE + `/${classId}/schedule`)}
            >
              Edit Schedule &nbsp;
              <Icon path={mdiArrowRight} size={0.8} />
            </Button>
          )}
        </div>
        <form onSubmit={handleSubmit} className='flex flex-row mt-5 mx-52 flex-wrap'>
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='gradeLevel' className='text-slate-800'>
              Grade Level
            </label>
            <FieldDynamicSelect
              fetchUrl={'options/grade-level'}
              initialValue={formType === 'edit' ? { label: classData.gradeLevel, value: classData.gradeLevel } : null}
              isClearable={true}
              onChange={setGradeLevelData}
              isDisabled={formType === 'edit' ? true : false}
            />
          </div>
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='section' className='text-slate-800'>
              Section
            </label>
            <input
              name='section'
              type='text'
              defaultValue={formType === 'edit' ? classData.section : ''}
              required
              disabled={formType === 'edit' ? true : false}
              className='rounded-md py-2 px-3 ring-1 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400'
            />
          </div>
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='schoolYear' className='text-slate-800'>
              School Year
            </label>
            <FieldDynamicSelect fetchUrl={'options/school-year'} initialValue={schoolYear} isDisabled />
          </div>
          <div className='flex flex-col w-1/2 space-y-2 px-3 mb-3'>
            <label htmlFor='adviser' className='text-slate-800'>
              Class Adviser
            </label>
            <FieldDynamicSelect
              fetchUrl={'options/users'}
              fetchParams={{ type: 'teacher', ...(formType === 'edit' ? { classId } : {}) }}
              isClearable={true}
              onChange={setAdviserData}
              initialValue={formType === 'edit' ? classData.adviser : null}
            />
          </div>
          <div className='flex flex-col w-full space-y-2 px-3 mb-3'>
            <label htmlFor='students' className='text-slate-800'>
              Student List
            </label>
            <StudentListTable
              classId={+classId}
              initialData={formType === 'edit' ? classData.students : null}
              onChange={setStudentList}
            />
          </div>

          <div className='flex flex-col w-full px-3 my-3 mt-5'>
            <Button className='w-full border-gray-300 capitalize' type='submit' radiusSize='lg' disabled={isLoading}>
              {isLoading ? 'Please wait...' : formType === 'add' ? `Add Class` : `Save changes`}
            </Button>
          </div>
        </form>
      </div>
    );
  }
};

export default ClassForm;
