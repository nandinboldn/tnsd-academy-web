// app/contact/page.tsx (for App Router)
'use client';
import { Input, Textarea, Button } from '@heroui/react';
import { Card, CardBody, CardHeader } from '@heroui/react';

// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // You can POST to /api/contact here
    alert('Message sent! (not really, backend pending)');
  };

  return (
    <div className='min-h-full flex flex-col items-center justify-center'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          name='name'
          placeholder='Full Name'
          value={formData.name}
          onChange={handleChange}
          variant='underlined'
          type='text'
          required
        />
        <span className='flex flex-row gap-5'>
          <Input
            name='email'
            placeholder='Your Email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            variant='underlined'
            required
          />

          <Input
            name='phone'
            placeholder='Your phone'
            value={formData.phone}
            type='phone'
            onChange={handleChange}
            variant='underlined'
            required
          />
        </span>
        <Textarea
          name='message'
          placeholder='Your Message'
          variant='bordered'
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
        />
        <div className='items-center justify-center flex'>
          <Button type='submit' variant='light'>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
