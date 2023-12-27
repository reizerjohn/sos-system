import React from 'react';
import { HOME_PAGE } from '@app/constants/routes';
import Button from './buttons/base';

interface Props {
  title: string;
  message: string;
}

const NotificationMessage = ({ title, message }: Props) => {
  return (
    <div className='w-full m-10 flex flex-col space-y-5'>
      <h2 className='text-2xl text-brand-cyan-300'>Notification Message</h2>
      <span className='text-lg'>
        {message} For more information about {title.toLowerCase()}, kindly visit your college or department.
      </span>

      <Button href={HOME_PAGE} fontSize='md' radiusSize='md' className='w-80'>
        {'Back to home page'}
      </Button>
    </div>
  );
};

export default NotificationMessage;
