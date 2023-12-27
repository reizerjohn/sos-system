/* eslint-disable max-len */
import { useAppContext } from '@app/contexts/app-context';
import { useStudentGradesContext } from '@app/contexts/student-grades-context';
import LoadingThreeDots from '../loading/three-dots';
import { useRef } from 'react';
import { isEmpty, round } from 'lodash';

const inputFieldStyles =
  'p-2 ring-1 text-gray-700 ring-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 w-full text-center';

const StudentGradesTable = () => {
  const { isLoading } = useAppContext();
  const { grades, setGrades } = useStudentGradesContext();
  const finalGradeInputRef = useRef([]);

  const handleChange = (index, field, value) => {
    const currentFields = [...grades];
    currentFields[index][field] = value;
    calculateFinalGrade(index);
    setGrades(currentFields);
  };

  const onKeyPressOnlyNumbers = (event) => {
    if (
      !(
        /[0-9]/.test(event.key) ||
        (event.ctrlKey && event.key === 'a') ||
        event.key === 'Backspace' ||
        event.key === 'Tab' ||
        event.key === '.'
      )
    ) {
      event.preventDefault();
    }
  };

  const calculateFinalGrade = (index) => {
    const currentFields = [...grades];
    let { q1, q2, q3, q4 } = currentFields[index];

    q1 = !isEmpty(q1) ? +q1 : 0;
    q2 = !isEmpty(q2) ? +q2 : 0;
    q3 = !isEmpty(q3) ? +q3 : 0;
    q4 = !isEmpty(q4) ? +q4 : 0;

    let inputCount = 0;

    for (const q of [q1, q2, q3, q4]) {
      if (q !== 0) inputCount++;
    }

    const totalGrade = q1 + q2 + q3 + q4;
    const average = round(totalGrade / inputCount, 2);

    if (average === 0 || isNaN(average)) {
      finalGradeInputRef.current[index].placeholder = '';
    } else {
      finalGradeInputRef.current[index].placeholder = average;
    }
  };

  return (
    <>
      {isLoading ? (
        <tr>
          <td colSpan={7}>
            <LoadingThreeDots />
          </td>
        </tr>
      ) : grades.length > 0 ? (
        grades.map((data, index) => (
          <tr key={`gradeField-${index}`}>
            {data.student ? (
              <td className='w-4/12'>
                <input
                  className={inputFieldStyles + ' text-left'}
                  name={`student-${index}`}
                  type='text'
                  required
                  disabled
                  value={data?.student ?? ''}
                />
              </td>
            ) : (
              <td className='w-4/12'>
                <input
                  className={inputFieldStyles + ' text-left'}
                  name={`subject-${index}`}
                  type='text'
                  required
                  disabled
                  value={data?.subject ?? ''}
                />
              </td>
            )}
            <td className='w-1/12 text-center'>
              <input
                className={inputFieldStyles}
                name={`q1-${index}`}
                type='text'
                onChange={(e) => handleChange(index, 'q1', e.target.value)}
                onKeyDown={(event) => onKeyPressOnlyNumbers(event)}
                value={data?.q1 ?? ''}
              />
            </td>
            <td className='w-1/12 text-center'>
              <input
                className={inputFieldStyles}
                name={`q2-${index}`}
                type='text'
                onChange={(e) => handleChange(index, 'q2', e.target.value)}
                onKeyDown={(event) => onKeyPressOnlyNumbers(event)}
                value={data?.q2 ?? ''}
              />
            </td>
            <td className='w-1/12 text-center'>
              <input
                className={inputFieldStyles}
                name={`q3-${index}`}
                type='text'
                onChange={(e) => handleChange(index, 'q3', e.target.value)}
                onKeyDown={(event) => onKeyPressOnlyNumbers(event)}
                value={data?.q3 ?? ''}
              />
            </td>
            <td className='w-1/12 text-center'>
              <input
                className={inputFieldStyles}
                name={`q4-${index}`}
                type='text'
                onChange={(e) => handleChange(index, 'q4', e.target.value)}
                onKeyDown={(event) => onKeyPressOnlyNumbers(event)}
                value={data?.q4 ?? ''}
              />
            </td>
            <td className='w-2/12 text-center'>
              <input
                className={inputFieldStyles}
                name={`finalGrade-${index}`}
                type='text'
                ref={(e) => (finalGradeInputRef.current[index] = e)}
                onChange={(e) => handleChange(index, 'finalGrade', e.target.value)}
                onKeyDown={(event) => onKeyPressOnlyNumbers(event)}
                value={data?.finalGrade ?? ''}
              />
            </td>
            <td className='w-2/12 text-center'>
              <input
                className={inputFieldStyles}
                name={`remarks-${index}`}
                type='text'
                onChange={(e) => handleChange(index, 'remarks', e.target.value)}
                value={data?.remarks ?? ''}
              />
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={7} className='text-center font-light italic text-gray-600'>
            No class subjects found
          </td>
        </tr>
      )}
    </>
  );
};

export default StudentGradesTable;
