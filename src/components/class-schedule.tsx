export type ClassScheduleType = {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

export const classScheduleHeaders = [
  'Time',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

interface Props {
  scheduleData: any[];
}

const ClassSchedulesTable = ({ scheduleData }: Props) => {
  return (
    <div className='mt-5'>
      <table className='border table w-full'>
        <thead>
          <tr className=''>
            {classScheduleHeaders.map((header) => (
              <td className='table-cell p-2 font-bold bg-gray-200 text-gray-800 border text-center'>{header}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {scheduleData?.map((d) => (
            <tr>
              {Object.keys(d).map((header) => (
                <td className='text-sm p-2 border w-16 text-brand-cyan-300 space-y-1 text-center'>
                  {d[header as keyof ClassScheduleType].split(',').map((splitVal) => (
                    <span className='flex flex-col'>{splitVal}</span>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassSchedulesTable;
