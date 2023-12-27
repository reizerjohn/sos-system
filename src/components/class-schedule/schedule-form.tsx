'use client';

import { useClassScheduleContext } from '@app/contexts/class-schedule-context';
import Button from '../buttons/base';
import AddScheduleField from './add-schedule-fields';
import { FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { clientApi } from '@app/lib/api';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';
import { useAppContext } from '@app/contexts/app-context';
import LoadingThreeDots from '../loading/three-dots';

interface Props {
  classId?: string;
}

const ClassScheduleForm = ({ classId }: Props) => {
  const { isLoading, setIsLoading } = useAppContext();
  const { schedules, fetchClassSchedules } = useClassScheduleContext();

  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let res = undefined;

      const scheduleList = schedules.map((s) => ({
        time: s.time.value,
        day: s.day.value,
        teacherId: s.teacher?.value,
        subjectId: s.subject?.value,
      }));

      res = await clientApi.post('classes/schedule', { data: { classId: +classId, schedules: scheduleList } });

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
    fetchClassSchedules({ classId });
  }, []);

  return (
    <div className='flex flex-col mx-14'>
      <div className='flex justify-center'>
        <h1 className='text-3xl font-semibold capitalize'>Edit Class Schedule</h1>
      </div>
      <div className='flex px-3 justify-start'>
        <Button
          className='capitalize text-sm'
          type='button'
          radiusSize='lg'
          color='secondary'
          onClick={() => router.back()}
        >
          <Icon path={mdiArrowLeft} size={0.8} />
          &nbsp;Back to Class
        </Button>
      </div>
      {isLoading ? (
        <LoadingThreeDots />
      ) : (
        <form onSubmit={handleSubmit} className='flex flex-col mt-5'>
          <div className='flex w-full space-x-5 p-2 text-center'>
            <label htmlFor='time' className='text-slate-700 font-semibold w-2/12'>
              Time
            </label>
            <label htmlFor='day' className='text-slate-700 font-semibold w-2/12'>
              Day
            </label>
            <label htmlFor='teacher' className='text-slate-700 font-semibold w-3/12'>
              Teacher
            </label>
            <label htmlFor='subject' className='text-slate-700 font-semibold w-4/12'>
              Subject
            </label>
            {schedules?.length > 1 && <div className='px-2'></div>}
          </div>
          <AddScheduleField />

          <div className='flex flex-col w-full px-3 my-3 mt-8'>
            <Button className='w-full border-gray-300 capitalize' type='submit' radiusSize='lg' disabled={isLoading}>
              {isLoading ? 'Please wait...' : `Save changes`}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ClassScheduleForm;
