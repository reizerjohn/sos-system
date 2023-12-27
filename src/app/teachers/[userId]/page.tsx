'use client';

import UserForm from '@app/components/teacher-management/teacher-form';
import { useParams } from 'next/navigation';

const EditUserPage = () => {
  const { userId } = useParams();

  return <UserForm formType='edit' userId={userId} />;
};

export default EditUserPage;
