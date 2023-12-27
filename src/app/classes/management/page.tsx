'use client';

import Button from '@app/components/buttons/base';
import ClassListTable from '@app/components/class-management/class-table';
import { CLASS_PAGE } from '@app/constants/routes';
import { useAppContext } from '@app/contexts/app-context';
import { useClassContext } from '@app/contexts/class-context';
import { mdiArrowLeft, mdiArrowRight, mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';
import { useRouter } from 'next/navigation';

const pageButtonStyle = `text-blue-600 text-sm border border-blue-600 bg-white py-2 px-3 rounded-lg flex
    items-center hover:bg-blue-50 disabled:text-neutral-300 disabled:border-neutral-300 disabled:hover:bg-transparent`;

const ClassesPage = () => {
  const { isLoading } = useAppContext();
  const { pageCount, setPageCount, hasNextButton, search, setSearch } = useClassContext();

  const router = useRouter();

  const handlePageButton = async (buttonType) => {
    if (buttonType === 'next') {
      setPageCount(pageCount + 1);
    } else {
      setPageCount(pageCount - 1);
    }
  };

  return (
    <div className='m-10'>
      <div className='flex flex-row justify-between items-center mb-5'>
        <h1 className='text-3xl'>Class Management</h1>
        <div className='flex space-x-2 w-1/2'>
          <div className='flex flex-auto'>
            <input
              type='text'
              placeholder='Search'
              value={search}
              className='bg-white w-full border-0 rounded-xl pl-12 h-[46px]'
              onChange={(e) => setSearch(e.target.value)}
            />
            <Icon className='absolute m-3' path={mdiMagnify} size={1} />
          </div>
          <div className='flex flex-row space-x-2'>
            <Button
              className='border-gray-300'
              paddingSize='sm'
              type='submit'
              radiusSize='lg'
              onClick={() => router.push(CLASS_PAGE)}
            >
              Add New Class
            </Button>
          </div>
        </div>
      </div>
      <ClassListTable />
      <div className='mt-4 flex justify-between'>
        <button
          disabled={pageCount === 1 || isLoading}
          onClick={() => handlePageButton('previous')}
          className={pageButtonStyle}
        >
          <Icon path={mdiArrowLeft} size={0.8} />
          &nbsp;Previous
        </button>
        <button
          disabled={!hasNextButton || isLoading}
          onClick={() => handlePageButton('next')}
          className={pageButtonStyle}
        >
          Next&nbsp;
          <Icon path={mdiArrowRight} size={0.8} />
        </button>
      </div>
    </div>
  );
};

export default ClassesPage;
