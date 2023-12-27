import { CLASS_PAGE } from '@app/constants/routes';
import { mdiArrowDown, mdiArrowUp, mdiCircleEditOutline, mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DeleteClassModal from './delete-class-modal';
import { useClassContext } from '@app/contexts/class-context';
import { useAppContext } from '@app/contexts/app-context';
import LoadingThreeDots from '../loading/three-dots';

const tableHeadClassName = 'border-b border-neutral-200 py-2 pl-4 text-neutral-600 sub-heading-xs-md text-start';
const tableDataClassName = 'border-b border-neutral-200 py-4 pl-4 text-neutral-700 sub-heading-xs';

interface ClassActionsProps {
  classId: number;
}

interface SortFieldProps {
  field: string;
}

const ClassActions = ({ classId }: ClassActionsProps) => {
  const [openDeleteClassModal, setOpenDeleteClassModal] = useState(false);

  const router = useRouter();

  return (
    <div className='flex items-center space-x-4'>
      <button
        type='button'
        onClick={() => router.push(CLASS_PAGE + `/${classId}`)}
        className='text-blue-600 font-semibold flex items-center space-x-2'
      >
        <Icon path={mdiCircleEditOutline} size={0.8} />
        &nbsp; Edit
      </button>
      <DeleteClassModal
        isOpen={openDeleteClassModal}
        onRequestClose={() => setOpenDeleteClassModal(false)}
        closeModal={() => setOpenDeleteClassModal(false)}
        classId={classId}
      />
      <button
        type='button'
        onClick={() => setOpenDeleteClassModal(true)}
        className='text-red-700 font-semibold flex items-center space-x-2'
      >
        <Icon path={mdiTrashCanOutline} size={0.8} />
        &nbsp; Delete
      </button>
    </div>
  );
};

const SortFieldIcon = ({ field }: SortFieldProps) => {
  const { sortBy, orderBy } = useClassContext();

  if (field === sortBy) {
    return orderBy === 'asc' ? (
      <Icon path={mdiArrowDown} size={0.6} className='inline' />
    ) : (
      <Icon path={mdiArrowUp} size={0.6} className='inline' />
    );
  }
};

const ClassListTable = () => {
  const { isLoading } = useAppContext();
  const { classes, search, pageCount, setPageCount, fetchClasses, setSortByField } = useClassContext();

  useEffect(() => {
    setPageCount(1);
    fetchClasses();
  }, [search]);

  useEffect(() => {
    fetchClasses();
  }, [pageCount]);

  return (
    <table className='table-fixed w-full'>
      <thead>
        <tr key='cols' className='bg-neutral-50'>
          <th className={tableHeadClassName}>
            <button type='button' onClick={() => setSortByField('gradeLevel')}>
              Grade Level <SortFieldIcon field={'gradeLevel'} />
            </button>
          </th>
          <th className={tableHeadClassName}>
            <button type='button' onClick={() => setSortByField('section')}>
              Section <SortFieldIcon field={'section'} />
            </button>
          </th>
          <th className={tableHeadClassName}>
            <button type='button' onClick={() => setSortByField('adviser')}>
              Adviser <SortFieldIcon field={'adviser'} />
            </button>
          </th>
          <th className={tableHeadClassName}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={4}>
              <LoadingThreeDots />
            </td>
          </tr>
        ) : classes.length > 0 ? (
          classes.map((val: any) => (
            <tr key={val.id}>
              <td className={tableDataClassName}>{val.gradeLevel}</td>
              <td className={tableDataClassName}>{val.section}</td>
              <td className={tableDataClassName}>{val.adviserName}</td>
              <td className={tableDataClassName}>
                <ClassActions classId={val.id} />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={4}
              className='text-center font-light italic text-gray-600 border-b border-neutral-200 py-2 pl-4'
            >
              No class found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ClassListTable;
