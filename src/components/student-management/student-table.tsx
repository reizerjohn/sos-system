import { STUDENTS_PAGE } from '@app/constants/routes';
import { mdiArrowDown, mdiArrowUp, mdiCircleEditOutline, mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import DeleteStudentModal from './delete-student-modal';
import { useStudentContext } from '@app/contexts/student-context';
import { useAppContext } from '@app/contexts/app-context';
import LoadingThreeDots from '../loading/three-dots';

interface StudentActionsProps {
  student: { id: number; name: string; type: UserType };
}

interface SortFieldProps {
  field: string;
}

const tableHeadClassName = 'border-b border-neutral-200 py-2 pl-4 text-neutral-600 sub-heading-xs-md text-start';
const tableDataClassName = 'border-b border-neutral-200 py-4 pl-4 text-neutral-700 sub-heading-xs';

const StudentActions = ({ student }: StudentActionsProps) => {
  const [openDeleteStudentModal, setOpenDeleteStudentModal] = useState(false);
  const router = useRouter();

  return (
    <div className='flex items-center space-x-4'>
      <button
        type='button'
        onClick={() => router.push(STUDENTS_PAGE + `/${student.id}`)}
        className='text-blue-600 font-semibold flex items-center space-x-2'
      >
        <Icon path={mdiCircleEditOutline} size={0.8} />
        &nbsp; Edit
      </button>
      <DeleteStudentModal
        isOpen={openDeleteStudentModal}
        onRequestClose={() => setOpenDeleteStudentModal(false)}
        closeModal={() => setOpenDeleteStudentModal(false)}
        student={student}
      />
      <button
        type='button'
        onClick={() => setOpenDeleteStudentModal(true)}
        className='text-red-700 font-semibold flex items-center space-x-2'
      >
        <Icon path={mdiTrashCanOutline} size={0.8} />
        &nbsp; Delete
      </button>
    </div>
  );
};

const SortFieldIcon = ({ field }: SortFieldProps) => {
  const { sortBy, orderBy } = useStudentContext();

  if (field === sortBy) {
    return orderBy === 'asc' ? (
      <Icon path={mdiArrowDown} size={0.6} className='inline' />
    ) : (
      <Icon path={mdiArrowUp} size={0.6} className='inline' />
    );
  }
};

const StudentTable = () => {
  const { isLoading } = useAppContext();
  const { students, search, pageCount, setPageCount, fetchStudents, setSortByField } = useStudentContext();

  useEffect(() => {
    setPageCount(1);
    fetchStudents();
  }, [search]);

  useEffect(() => {
    fetchStudents();
  }, [pageCount]);

  return (
    <table className='table-fixed w-full'>
      <thead>
        <tr key='column' className='bg-neutral-50'>
          <th className={tableHeadClassName}>
            <button type='button' onClick={() => setSortByField('idNumber')}>
              LRN <SortFieldIcon field={'idNumber'} />
            </button>
          </th>
          <th className={tableHeadClassName}>
            <button type='button' onClick={() => setSortByField('name')}>
              Name <SortFieldIcon field={'name'} />
            </button>
          </th>
          <th className={tableHeadClassName}>Grade Level</th>
          <th className={tableHeadClassName}>Section</th>
          <th className={tableHeadClassName}>
            <button type='button' onClick={() => setSortByField('gender')}>
              Gender <SortFieldIcon field={'gender'} />
            </button>
          </th>
          <th className={tableHeadClassName}>
            <button type='button' onClick={() => setSortByField('status')}>
              Status <SortFieldIcon field={'status'} />
            </button>
          </th>
          <th className={tableHeadClassName}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={7}>
              <LoadingThreeDots />
            </td>
          </tr>
        ) : students.length > 0 ? (
          students.map((val) => (
            <tr key={'student-' + val.id}>
              <td className={tableDataClassName}>{val.idNumber}</td>
              <td className={tableDataClassName}>{val.fullName}</td>
              <td className={tableDataClassName}>{val.class?.gradeLevel}</td>
              <td className={tableDataClassName}>{val.class?.section}</td>
              <td className={tableDataClassName}>{val.student.gender}</td>
              <td className={tableDataClassName}>{val.student.status}</td>
              <td className={tableDataClassName}>
                <StudentActions
                  student={{
                    id: val.id,
                    name: val.fullName,
                    type: val.type,
                  }}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={7}
              className='text-center font-light italic text-gray-600 border-b border-neutral-200 py-2 pl-4'
            >
              No students found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StudentTable;
