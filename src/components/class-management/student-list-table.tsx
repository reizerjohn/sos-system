import { mdiTrashCanOutline } from '@mdi/js';
import FieldDynamicSelect, { FieldDynamicSelectRef, OptionType } from '../fields/dynamic-select';
import { useState, useRef, useEffect } from 'react';
import Icon from '@mdi/react';
import Button from '../buttons/base';

interface Props {
  classId?: number;
  initialData?: OptionType[];
  onChange?: (option: OptionType[]) => void;
}

const StudentListTable = ({ classId, initialData, onChange }: Props) => {
  const [data, setData] = useState<OptionType[]>(initialData || []);
  const [addStudentData, setAddStudentData] = useState<OptionType | null>(null);
  const [isStudentDelete, setIsStudentDelete] = useState(false);

  const dynamicFieldRef = useRef<FieldDynamicSelectRef>(null);

  const handleDelete = (rowKey: number) => {
    const filterData = data.filter((r) => r.value !== rowKey);
    setData(filterData);
    setIsStudentDelete(true);
  };

  const addNewStudent = () => {
    if (addStudentData) {
      const studentExists = data.find((s) => s.value === addStudentData.value);

      if (!studentExists) {
        setData([...data, addStudentData]);
        dynamicFieldRef.current?.reset();
      }
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange(data);
    }
  }, [data]);

  useEffect(() => {
    if (isStudentDelete) {
      dynamicFieldRef.current.reset();
      setIsStudentDelete(false);
    }
  }, [isStudentDelete]);

  return (
    <>
      <table>
        <thead>
          <tr key='cols' className='bg-neutral-50 border border-gray-200'>
            <th className='py-2 pl-4 text-neutral-600 text-start'>Student Name</th>
          </tr>
        </thead>
        <tbody className='flex flex-col h-[200px] overflow-auto bg-gray-200 border border-gray-200'>
          {data.map((val: OptionType) => (
            <tr key={val.value} className='flex flex-row justify-between bg-neutral-100 border-b border-neutral-200'>
              <td className='py-4 px-5 pl-4 text-neutral-700'>{val.label}</td>
              <td className='py-4 px-5 pl-4 text-neutral-700'>
                <button
                  type='button'
                  onClick={() => handleDelete(val.value)}
                  className='text-red-700 font-semibold flex items-center space-x-2'
                >
                  <Icon path={mdiTrashCanOutline} size={0.8} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex flex-row w-full pt-2'>
        <div className='w-4/5 pr-5'>
          <FieldDynamicSelect
            fetchUrl={'options/users/students'}
            isClearable={true}
            placeholder='Select student...'
            onChange={setAddStudentData}
            initialValue={addStudentData}
            excludeData={data}
            fetchParams={{ classId }}
            ref={dynamicFieldRef}
          />
        </div>
        <Button
          className='w-1/5 border-gray-300 capitalize px-4 py-0'
          type='button'
          radiusSize='lg'
          fontSize='md'
          onClick={() => addNewStudent()}
        >
          Add Student
        </Button>
      </div>
    </>
  );
};

export default StudentListTable;
