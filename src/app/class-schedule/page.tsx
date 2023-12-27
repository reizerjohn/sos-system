/* eslint-disable max-len */
'use client';

import { useState, useEffect } from 'react';
import ClassSchedulesTable from '@app/components/class-schedule';
import { clientApi } from '@app/lib/api';
import { scheduleDays, scheduleTime } from '@app/constants/defaults';
import { useAppContext } from '@app/contexts/app-context';
import LoadingThreeDots from '@app/components/loading/three-dots';
import { isEmpty } from 'lodash';

const ClassSchedulePage = () => {
  const [schedules, setSchedules] = useState(undefined);
  const { user, fetchUserData, isLoading, setIsLoading } = useAppContext();

  const fetchClassSchedule = async () => {
    setIsLoading(true);
    const { data } = await clientApi.get('classes/schedule');

    let scheduleList = scheduleTime.map((t) => {
      let format = { time: t };

      for (const day of scheduleDays) {
        format[day] = '';
      }

      return format;
    });

    for (const schedule of data) {
      const timeSchedule = scheduleList.find((s) => s.time === schedule.time);
      timeSchedule[schedule.day] = !isEmpty(timeSchedule[schedule.day])
        ? timeSchedule[schedule.day].concat(',', schedule.subject.name)
        : schedule.subject.name;
    }

    setSchedules(scheduleList);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserData();
    fetchClassSchedule();
  }, []);

  return isLoading ? (
    <LoadingThreeDots />
  ) : (
    user && (
      <div className='flex flex-col m-10 grow'>
        <h2 className='text-3xl'>Class Schedules</h2>
        {user.type === 'student' && (
          <div className='flex flex-col mt-5'>
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
        )}

        <ClassSchedulesTable scheduleData={schedules} />
      </div>
    )
  );
};

export default ClassSchedulePage;
