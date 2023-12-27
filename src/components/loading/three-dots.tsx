'use client';

import { ThreeDots } from 'react-loader-spinner';

const LoadingThreeDots = () => {
  return (
    <div className='flex justify-center items-center align-middle'>
      <ThreeDots
        height='80'
        width='80'
        radius='9'
        color='grey'
        ariaLabel='three-dots-loading'
        wrapperStyle={{}}
        visible={true}
      />
    </div>
  );
};

export default LoadingThreeDots;
