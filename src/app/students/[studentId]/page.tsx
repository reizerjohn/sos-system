'use client';

import StudentForm from '@app/components/student-management/student-form';
import { useParams } from 'next/navigation';

const EditStudentPage = () => {
  const { studentId } = useParams();
  
  return <StudentForm formType='edit' studentId={studentId} />;
};

export default EditStudentPage;
