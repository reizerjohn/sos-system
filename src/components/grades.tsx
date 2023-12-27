'use client';

import { useAppContext } from '@app/contexts/app-context';
import { useStudentGradesContext } from '@app/contexts/student-grades-context';
import { useEffect } from 'react';

const tableHeadersStyle =
  'table-cell p-2 font-bold bg-gray-200 text-gray-800 text-center text-sm border border-gray-300';
const tableRowStyle = 'p-2 text-gray-700 border border-gray-200';

const GradesTable = () => {
  const { isLoading } = useAppContext();
  const { grades, schoolYear, fetchStudentGrades } = useStudentGradesContext();

  useEffect(() => {
    fetchStudentGrades({});
  }, [schoolYear]);

  return (
    <>
      <table className='w-full bg-gray-50'>
        <thead>
          <tr>
            <th rowSpan={2} className={tableHeadersStyle + ' w-4/1'}>
              Subjects
            </th>
            <th colSpan={4} className={tableHeadersStyle + ' w-4/12'}>
              Quarter
            </th>
            <th rowSpan={2} className={tableHeadersStyle + ' w-2/12'}>
              Final Grade
            </th>
            <th rowSpan={2} className={tableHeadersStyle + ' w-2/12'}>
              REMARKS
            </th>
          </tr>
          <tr>
            <th className={tableHeadersStyle}>1</th>
            <th className={tableHeadersStyle}>2</th>
            <th className={tableHeadersStyle}>3</th>
            <th className={tableHeadersStyle}>4</th>
          </tr>
        </thead>
        <tbody>
          {grades.length > 0 &&
            grades.map((data, index) => (
              <tr key={'row-' + index}>
                <td className={tableRowStyle + ' w-4/1 text-center'}>{data.subject}</td>
                <td className={tableRowStyle + ' w-1/12 text-center'}>{data.q1}</td>
                <td className={tableRowStyle + ' w-1/12 text-center'}>{data.q2}</td>
                <td className={tableRowStyle + ' w-1/12 text-center'}>{data.q3}</td>
                <td className={tableRowStyle + ' w-1/12 text-center'}>{data.q4}</td>
                <td className={tableRowStyle + ' w-2/12 text-center'}>{data.finalGrade}</td>
                <td className={tableRowStyle + ' w-2/12 text-center'}>{data.remarks}</td>
              </tr>
            ))}
          {!isLoading && grades.length === 0 && (
            <tr>
              <td colSpan={8} className='text-center border border-gray-300 p-1 font-light italic text-gray-600'>
                No grades found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default GradesTable;
