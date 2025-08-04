import React from 'react';

const IntroSection = props => {
  return (
    <div className='bg-lightblue p-20 text-black'>
      <div className='text-center'>
        <h1 className='titleBold text-2xl mb-5'>
          BE YOUR BEST. LEARN HOW TO WIN
        </h1>
        <p>
          At TNSD Academy every player aims to be their best. Whether you're a
          young player aiming for the stars, a seasoned enthusiast, or a former
          professional keeping your game sharp, our Academy is the place for
          you. Set against a backdrop of the Adriatic Sea and equipped with
          top-tier facilities, we blend structured training with a welcoming
          environment. Our team of certified, experienced coaches is committed
          to helping you reach your goals, refine your technique, and reignite
          your love for the game, no matter your level.
        </p>
      </div>

      <div className='flex flex-col md:flex-row gap-5 my-10'>
        <div className='border-1 border-black rounded-sm p-5'>
          <div className='titleBold text-left'>
            <h1>OUR PROMISE</h1>
            <h1 className='text-blue'>TO YOU</h1>
          </div>
          <p>
            We are here to build winners on and off the court. Our mission is to
            guide players toward excellence — in mindset, discipline, and
            performance.
          </p>
        </div>
        <div className='border-1 border-black rounded-sm p-5'>
          <div className='titleBold text-left'>
            <h1 className='text-red-800'>INDIVIDUAL</h1>
            <h1>APPROACH</h1>
          </div>
          <p>
            We work with each player individually. Every training plan is
            adapted to maximize potential, technique, and match-readiness.
          </p>
        </div>
        <div className='border-1 border-black rounded-sm p-5'>
          <div className='titleBold text-left'>
            HAVING<span className='text-green-800'> FUN</span>
            <h1>MATTERS</h1>
          </div>
          <p>
            We are here to build winners on and off the court. Our mission is to
            guide players toward excellence — in mindset, discipline, and
            performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
