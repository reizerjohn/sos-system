import { useAppContext } from '@app/contexts/app-context';
import LoadingThreeDots from '../loading/three-dots';

interface PageProps {
  students: any[];
}

const tableHeadClassName = 'border-b border-neutral-200 py-2 pl-4 text-neutral-600 sub-heading-xs-md text-start';
const tableDataClassName = 'border-b border-neutral-200 py-4 pl-4 text-neutral-700 sub-heading-xs';

const SubjectStudentsTable = ({ students }: PageProps) => {
  const { isLoading } = useAppContext();

  return (
    <table className='table-fixed w-full'>
      <thead>
        <tr key='column' className='bg-neutral-50'>
          <th className={tableHeadClassName}>LRN</th>
          <th className={tableHeadClassName}>Name</th>
          <th className={tableHeadClassName}>Grade Level</th>
          <th className={tableHeadClassName}>Gender</th>
          <th className={tableHeadClassName}>Birthday</th>
          <th className={tableHeadClassName}>Status</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={6}>
              <LoadingThreeDots />
            </td>
          </tr>
        ) : students.length > 0 ? (
          students.map((val) => (
            <tr key={'student-' + val.id}>
              <td className={tableDataClassName}>{val.idNumber}</td>
              <td className={tableDataClassName}>{val.fullName}</td>
              <td className={tableDataClassName}>{val.gradeLevel}</td>
              <td className={tableDataClassName}>{val.gender}</td>
              <td className={tableDataClassName}>{val.birthday}</td>
              <td className={tableDataClassName}>{val.status}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={6}
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

export default SubjectStudentsTable;
