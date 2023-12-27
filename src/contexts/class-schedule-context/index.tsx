'use client';

import { OptionType } from '@app/components/fields/dynamic-select';
import { clientApi } from '@app/lib/api';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useAppContext } from '../app-context';

export interface ClassScheduleType {
  time: OptionType;
  day: OptionType;
  teacher: OptionType;
  subject: OptionType;
}

export type ClassScheduleContextType = {
  schedules: ClassScheduleType[];
  setSchedules: (schedules: ClassScheduleType[]) => void;
  fetchClassSchedules: ({ classId }: { classId: string }) => void;
};

interface Props {
  children: ReactNode;
}

export const newScheduleField = { time: null, day: null, teacher: null, subject: null };

const ClassScheduleContext = createContext<ClassScheduleContextType>(undefined);

const ClassScheduleProvider = ({ children }: Props) => {
  const { setIsLoading } = useAppContext();
  const [schedules, setSchedules] = useState<ClassScheduleType[]>([]);

  const fetchClassSchedules = async ({ classId }) => {
    setIsLoading(true);
    const params = { classId };
    const { data } = await clientApi.get('classes/schedule', { params });

    if (data.length === 0) {
      setSchedules([{ ...newScheduleField }]);
    } else {
      setSchedules(data);
    }

    setIsLoading(false);
  };

  const value = {
    schedules,
    setSchedules,
    fetchClassSchedules,
  };

  return <ClassScheduleContext.Provider value={value}>{children}</ClassScheduleContext.Provider>;
};

const useClassScheduleContext = () => useContext<ClassScheduleContextType>(ClassScheduleContext);

export { ClassScheduleProvider, useClassScheduleContext };
