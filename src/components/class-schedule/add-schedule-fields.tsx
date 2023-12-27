/* eslint-disable max-len */
import Icon from '@mdi/react';
import { mdiClose, mdiPlus } from '@mdi/js';
import { useClassScheduleContext } from '@app/contexts/class-schedule-context';
import FieldDynamicSelect from '../fields/dynamic-select';
import { newScheduleField } from '@app/contexts/class-schedule-context';
import { useAppContext } from '@app/contexts/app-context';
import { useRef } from 'react';

const buttonStyle = `w-1/6 border-gray-300 capitalize bg-gray-200 hover:bg-gray-300 border
  rounded-md py-1 text-sm text-gray-700 font-semibold center flex justify-center`;

const AddScheduleField = () => {
  const { isLoading } = useAppContext();
  const { schedules, setSchedules } = useClassScheduleContext();
  const inputFieldRefs = useRef([]);

  const handleAddButton = () => {
    setSchedules([...schedules, { ...newScheduleField }]);
  };

  const handleDeleteButton = (index) => {
    const currentFields = [...schedules];
    currentFields.splice(index, 1);
    setSchedules(currentFields);
  };

  const handleChange = (index, field, value) => {
    const currentFields = [...schedules];
    currentFields[index][field] = value;

    setSchedules(currentFields);
  };

  if (!isLoading && schedules.length > 0) {
    return (
      <>
        {schedules.map((data, index) => (
          <div key={index} className='flex w-full space-x-5 p-2'>
            <FieldDynamicSelect
              className='w-2/12'
              fetchUrl={'options/class-schedule/time'}
              onChange={(e) => handleChange(index, 'time', e)}
              ref={(e) => (inputFieldRefs.current[index] = e)}
              initialValue={data?.time}
            />
            <FieldDynamicSelect
              className='w-2/12'
              fetchUrl={'options/class-schedule/day'}
              onChange={(e) => handleChange(index, 'day', e)}
              // ref={(e) => (inputFieldRefs.current[index]['day'] = e)}
              isDisabled
              initialValue={data?.day}
            />
            <FieldDynamicSelect
              className='w-4/12'
              fetchUrl={'options/users/teachers'}
              onChange={(e) => handleChange(index, 'teacher', e)}
              // ref={(e) => (inputFieldRefs.current[index]['teacher'] = e)}
              isDisabled
              initialValue={data?.teacher}
            />
             <FieldDynamicSelect
              className='w-4/12'
              fetchUrl={'options/subjects'}
              onChange={(e) => handleChange(index, 'subject', e)}
              // ref={(e) => (inputFieldRefs.current[index]['subject'] = e)}
              isDisabled
              initialValue={data?.subject}
            />
            {schedules.length > 1 && (
              <div className='flex items-middle'>
                <button type='button' onClick={() => handleDeleteButton(index)} className='text-red-700 font-bold'>
                  <Icon path={mdiClose} size={0.8} />
                </button>
              </div>
            )}
          </div>
        ))}

        <div className='px-3 mt-2 flex justify-center'>
          <button type='button' onClick={() => handleAddButton()} className={buttonStyle}>
            <Icon path={mdiPlus} size={0.8} />
          </button>
        </div>
      </>
    );
  }
};

export default AddScheduleField;
