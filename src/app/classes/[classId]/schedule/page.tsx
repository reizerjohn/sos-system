'use client';

import ClassScheduleForm from '@app/components/class-schedule/schedule-form';
import { useParams } from 'next/navigation';

const ClassSchedulePage = () => {
  const { classId } = useParams();
    
  return <ClassScheduleForm classId={classId} />;
};

export default ClassSchedulePage;
