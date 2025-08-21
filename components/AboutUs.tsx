import { Button } from '@heroui/button';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Gunburd B.',
    role: 'Head Coach & Founder',
    image: '/team/avatar1.jpg' // Store in /public/team/
  },
  {
    name: 'Urnukh B.',
    role: 'Performance Director',
    image: '/team/avatar1.jpg'
  },
  {
    name: 'Baatarsuren B.',
    role: 'Performance Director',
    image: '/team/avatar1.jpg'
  },
  {
    name: 'Badrakh M.',
    role: 'Fitness & Conditioning',
    image: '/team/avatar1.jpg'
  }
];

const testimonials = [
  {
    name: 'Sophia M.',
    text: 'Training here changed my game. The coaches are incredibly focused and professional.'
  },
  {
    name: 'Luka R.',
    text: 'Excellent environment for young players. The discipline and passion are unmatched.'
  }
];

export default function AboutUs() {
  return (
    <div className='w-full bg-transparent px-4 sm:px-8 lg:px-20'>
      {/* Hero Section */}
      <section className='py-10 text-center'>
        <h1 className='text-4xl sm:text-5xl font-bold mb-6'>TNSD Academy</h1>
        <p className='text-lg max-w-3xl mx-auto'>
          Built on the legacy of excellence, our academy provides elite tennis
          training guided by top-tier professionals in a world-class setting.
        </p>
        <Button className='bg-yellowski text-black my-10'>BOOK A CLASS</Button>
      </section>

      <section className='bg-blue w-screen p-10 text-center'>
        <div className='flex flex-row gap-20 justify-center '>
          <div>
            <h1 className='text-5xl font-bold'>340</h1>
            <p>days of training</p>
            <hr className='my-4 border-yellowski border-1 w-1/2 justify-self-center' />
          </div>
          <div>
            <h1 className='text-5xl font-bold'>4</h1>
            <p>coaches</p>
            <hr className='my-4 border-yellowski border-1 w-1/2 justify-self-center' />
          </div>
          <div>
            <h1 className='text-5xl font-bold'>50+</h1>
            <p>active players</p>
            <hr className='my-4 border-yellowski border-1 w-1/2 justify-self-center' />
          </div>
        </div>
      </section>
      {/* Image & Description */}
      <section className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12'>
        <div className='space-y-6 text-lg leading-relaxed'>
          <p>
            At our Tennis Academy, we believe in developing well-rounded
            athletes. We use proven training methods to cultivate strong
            technical, tactical, and mental skills.
          </p>
          <p>
            Our coaching team comprises former ATP/WTA professionals and
            certified trainers who are committed to player development at every
            level.
          </p>
          <p>
            With premium facilities and a performance-focused culture, we
            prepare players for the global stage — whether that’s college tennis
            or the pro circuit.
          </p>
        </div>
        <div className='relative w-full h-[400px] rounded-xl overflow-hidden shadow-xl'>
          <Image
            src='/tennis_court2.jpg'
            alt='Academy overview'
            layout='fill'
            objectFit='cover'
            className='rounded-xl'
          />
        </div>
      </section>

      {/* Team Section */}
      <section className='py-16 text-center'>
        <h2 className='text-3xl font-bold mb-10'>Meet the Team</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
          {teamMembers.map(member => (
            <div key={member.name} className='flex flex-col items-center'>
              <div className='w-40 h-40 relative rounded-full overflow-hidden shadow-md mb-4'>
                <Image
                  src={member.image}
                  alt={member.name}
                  layout='fill'
                  objectFit='cover'
                />
              </div>
              <h3 className='text-xl font-semibold'>{member.name}</h3>
              <p className='text-lightblue'>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className='py-20 text-center text-black bg-lightblue rounded-xl'>
        <h2 className='text-3xl font-bold mb-6'>Watch Our Story</h2>
        <div className='aspect-w-16 aspect-h-9 mx-auto max-w-4xl rounded-xl overflow-hidden shadow-lg'>
          <iframe
            src='https://www.youtube.com/embed/vwN2bLZVQmY'
            title='Academy video'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            className='w-full h-full'></iframe>
        </div>
      </section>

      {/* Testimonials */}
      <section className='py-20'>
        <h2 className='text-3xl font-bold text-center mb-12'>
          What Our Players Say
        </h2>
        <div className='grid gap-10 sm:grid-cols-2'>
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className='bg-lightblue p-6 rounded-sm shadow-md text-blue'>
              <p className='text-lg italic mb-4'>“{t.text}”</p>
              <p className='text-right font-semibold text-gray-700'>
                — {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
