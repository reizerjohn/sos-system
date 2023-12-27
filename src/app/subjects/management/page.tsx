'use client';

import { useEffect, useRef, useState } from 'react';
import FieldDynamicSelect, { FieldDynamicSelectRef, OptionType } from '../../../components/fields/dynamic-select';
import { useAppContext } from '@app/contexts/app-context';
import Button from '@app/components/buttons/base';
import { SUBJECTS_PAGE } from '@app/constants/routes';
import { useRouter } from 'next/navigation';
import SubjectStudentsTable from '@app/components/subjects-management/subjects-table';
import { clientApi } from '@app/lib/api';
import { isEmpty } from 'lodash';
import DeleteSubjectModal from '@app/components/subjects-management/delete-subject-modal';

const SubjectsPage = () => {
  const { setIsLoading } = useAppContext();
  const [subject, setSubject] = useState<OptionType | null>(null);
  const [students, setStudents] = useState([]);
  const [openDeleteSubjectModal, setOpenDeleteSubjectModal] = useState(false);
  const [isSubjectDelete, setIsSubjectDelete] = useState(false);
  const dynamicFieldRef = useRef<FieldDynamicSelectRef>(null);

  const router = useRouter();

  const fetchStudents = async () => {
    setIsLoading(true);

    const { data } = await clientApi.get('subjects/students', { params: { subjectId: subject.value } });

    setStudents(data.students);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isEmpty(subject)) {
      fetchStudents();
    }
  }, [subject]);

  useEffect(() => {
    if (isSubjectDelete) {
      setSubject(null);
      setStudents([]);
      dynamicFieldRef.current.reset();

      setIsSubjectDelete(false);
    }
  }, [isSubjectDelete]);

  return (
    <div className='flex flex-col mx-32'>
      <div className='flex justify-center mb-5'>
        <h1 className='text-3xl font-semibold capitalize'>Subjects List</h1>
      </div>

      <div className='flex flex-row items-center space-x-2 px-3 mb-5'>
        <p>Select Subject: </p>
        <FieldDynamicSelect
          fetchUrl={'options/subjects'}
          isClearable={true}
          placeholder='Select subject...'
          onChange={setSubject}
          ref={dynamicFieldRef}
          className='grow'
        />
        {subject && (
          <>
            <Button
              className='border-gray-300'
              paddingSize='sm'
              type='button'
              radiusSize='lg'
              color='secondary'
              onClick={() => router.push(SUBJECTS_PAGE + `/${subject.value}`)}
            >
              Edit
            </Button>
            <DeleteSubjectModal
              isOpen={openDeleteSubjectModal}
              onRequestClose={() => setOpenDeleteSubjectModal(false)}
              closeModal={() => setOpenDeleteSubjectModal(false)}
              onDelete={() => setIsSubjectDelete(true)}
              subjectId={subject.value}
            />
            <Button
              className='border-gray-300'
              paddingSize='sm'
              type='button'
              radiusSize='lg'
              color='red'
              onClick={() => setOpenDeleteSubjectModal(true)}
            >
              Delete
            </Button>
          </>
        )}
        <Button
          className='border-gray-300'
          paddingSize='sm'
          type='submit'
          radiusSize='lg'
          onClick={() => router.push(SUBJECTS_PAGE)}
        >
          Add New Subject
        </Button>
      </div>

      {subject && <SubjectStudentsTable students={students} />}
    </div>
  );
};

export default SubjectsPage;
