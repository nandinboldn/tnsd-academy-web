import { Button, Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import Image from 'next/image';
import React from 'react';

const ClassesSection = props => {
  return (
    <div className='flex flex-col md:flex-row gap-10 p-10 bg-blue justify-center'>
      <Card className='h-[300px] col-span-12 sm:col-span-5' radius='none'>
        <Image
          alt='Card example background'
          width={200}
          height={200}
          className='z-0 w-full h-full'
          src='/tennis_court2.jpg'
        />
        <CardFooter className='absolute bg-transparent bottom-0 z-10 text-white '>
          <div className='self-start'>
            <p>TENNIS CLASSES</p>
            <p className='text-xl titleBold my-5'>
              <span className='text-yellowski'>CLASSES</span> FOR PLAYERS OF ALL
              AGES AND LEVELS
            </p>
            <Button
              className='text-l p-3 titleBold bg-yellowski text-black'
              radius='none'
              size='sm'>
              LEARN MORE
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Card className='h-[300px] col-span-12 sm:col-span-5' radius='none'>
        <Image
          alt='Card example background'
          width={200}
          height={200}
          className='z-0 w-full h-full'
          src='/tennis_court3.jpg'
        />
        <CardFooter className='absolute bg-transparent bottom-0 z-10 text-white '>
          <div className='self-start'>
            <p>TENNIS CLASSES</p>
            <p className='text-xl titleBold my-5'>
              <span className='text-yellowski'>CLASSES</span> FOR PLAYERS OF ALL
              AGES AND LEVELS
            </p>
            <Button
              className='text-l p-3 titleBold bg-yellowski text-black'
              radius='none'
              size='sm'>
              LEARN MORE
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClassesSection;
