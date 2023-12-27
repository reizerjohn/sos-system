'use client';

import SubjectForm from '@app/components/subjects-management/subject-form';
import { useParams } from 'next/navigation';

const EditSubjectPage = () => {
  const { subjectId } = useParams();
  
  return <SubjectForm formType='edit' subjectId={+subjectId} />;
};

export default EditSubjectPage;
