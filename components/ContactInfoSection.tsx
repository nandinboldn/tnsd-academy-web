import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardBody } from '@heroui/react';

export default function ContactInfoSection() {
  return (
    <section className='w-full bg-lightblue py-20 px-4 sm:px-8 lg:px-20 border-t'>
      <div className='max-w-6xl mx-auto text-center mb-12'>
        <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
          Get in Touch
        </h2>
        <p className='text-gray-600 text-lg'>
          We’d love to hear from you. Reach out for training inquiries,
          partnerships, or to visit our academy.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
        {/* Address */}
        <Card className='text-center bg-blue rounded-sm'>
          <CardBody className='p-6'>
            <div className='flex justify-center mb-4 text-yellowski'>
              <MapPin className='w-6 h-6' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Visit Us</h3>
            <p className='text-gray-400'>
              TNSD Academy
              <br />
              Khan-Uul district 18th khoroo, Ulaanbaatar, Mongolia, 11000
            </p>
          </CardBody>
        </Card>

        {/* Phone */}
        <Card className='text-center bg-blue rounded-sm'>
          <CardBody className='p-6'>
            <div className='flex justify-center mb-4 text-yellowski'>
              <Phone className='w-6 h-6' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Call Us</h3>
            <p className='text-gray-400'>
              +385 99 123 4567
              <br />
              Mon–Sat, 9am–6pm
            </p>
          </CardBody>
        </Card>

        {/* Email */}
        <Card className='text-center bg-blue rounded-sm'>
          <CardBody className='p-6'>
            <div className='flex justify-center mb-4 text-yellowski'>
              <Mail className='w-6 h-6' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Email</h3>
            <p className='text-gray-400'>
              info@youracademy.com
              <br />
              We respond within 24 hours
            </p>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
