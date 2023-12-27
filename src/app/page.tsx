import Image from 'next/image';

// Root page/home page
// Url: '/'

export default async function Home() {
  return (
    <div className='w-full flex-col justify-center items-center'>
      <h2 className='text-center text-3xl underline underline-offset-8 pb-10 text-gray-800 font-bold'>
        {`Welcome to Saint Robert's Website!`}
      </h2>
      <Image
        src={'/images/st-roberts-bg.png'}
        alt="St. Robert's Logo"
        width={800}
        height={20}
        className='object-contain bg mx-auto drop-shadow-lg border-8 border-gray-200'
      />
    </div>
  );
}
