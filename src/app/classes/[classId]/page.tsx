'use client';

import ClassForm from '@app/components/class-management/class-form';
import { useParams } from 'next/navigation';

const EditClassPage = () => {
  const { classId } = useParams();
  
  return <ClassForm formType='edit' classId={classId} />;
};

export default EditClassPage;
