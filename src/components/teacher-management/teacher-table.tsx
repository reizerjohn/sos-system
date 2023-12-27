import { mdiCircleEditOutline, mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useRouter } from 'next/navigation';
import DeleteUserModal from './delete-teacher-modal';
import { useState, useEffect } from 'react';
import { useUserContext } from '@app/contexts/user-context';
import { TEACHERS_PAGE } from '@app/constants/routes';
import { useAppContext } from '@app/contexts/app-context';
import { mdiArrowUp, mdiArrowDown } from '@mdi/js';
import LoadingThreeDots from '../loading/three-dots';

interface UserActionsProps {
  user: { id: number; name: string; type: UserType };
}

interface SortFieldProps {
  field: string;
}

const tableHeadClassName = 'border-b border-neutral-200 py-2 pl-4 text-neutral-600 sub-heading-xs-md text-start';
const tableDataClassName = 'border-b border-neutral-200 py-4 pl-4 text-neutral-700 sub-heading-xs capitalize';

const UserActions = ({ user }: UserActionsProps) => {
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
  const router = useRouter();

  return (
    <div className='flex items-center space-x-4'>
      <button
        type='button'
        onClick={() => router.push(TEACHERS_PAGE + `/${user.id}`)}
        className='text-blue-600 font-semibold flex items-center space-x-2'
      >
        <Icon path={mdiCircleEditOutline} size={0.8} />
        &nbsp; Edit
      </button>
      <DeleteUserModal
        isOpen={openDeleteUserModal}
        onRequestClose={() => setOpenDeleteUserModal(false)}
        closeModal={() => setOpenDeleteUserModal(false)}
        user={user}
      />
      <button
        type='button'
        onClick={() => setOpenDeleteUserModal(true)}
        className='text-red-700 font-semibold flex items-center space-x-2'
      >
        <Icon path={mdiTrashCanOutline} size={0.8} />
        &nbsp; Delete
      </button>
    </div>
  );
};

const SortFieldIcon = ({ field }: SortFieldProps) => {
  const { sortBy, orderBy } = useUserContext();

  if (field === sortBy) {
    return orderBy === 'asc' ? (
      <Icon path={mdiArrowDown} size={0.6} className='inline' />
    ) : (
      <Icon path={mdiArrowUp} size={0.6} className='inline' />
    );
  }
};

const UserTable = () => {
  const { isLoading } = useAppContext();
  const { users, search, pageCount, setPageCount, fetchUsers, setSortByField } = useUserContext();

  useEffect(() => {
    setPageCount(1);
    fetchUsers();
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [pageCount]);

  return (
    <table className='table-fixed w-full'>
      <thead>
        <tr key='cols' className='bg-neutral-50'>
          <th className={tableHeadClassName}>
            <button type='button' onClick={() => setSortByField('idNumber')}>
              ID <SortFieldIcon field={'idNumber'} />
            </button>
          </th>
          <th className={tableHeadClassName}>
            <button type='button' onClick={() => setSortByField('name')}>
              Name <SortFieldIcon field={'name'} />
            </button>
          </th>
          <th className={tableHeadClassName}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={3}>
              <LoadingThreeDots />
            </td>
          </tr>
        ) : users.length > 0 ? (
          users.map((val: any) => (
            <tr key={val.id}>
              <td className={tableDataClassName}>{val.idNumber}</td>
              <td className={tableDataClassName}>{val.fullName}</td>
              <td className={tableDataClassName}>
                <UserActions user={{ id: val.id, name: val.fullName, type: val.type }} />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={7}
              className='text-center font-light italic text-gray-600 border-b border-neutral-200 py-2 pl-4'
            >
              No teachers found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
