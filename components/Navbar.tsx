// --- components/Navbar.tsx ---
'use client';
import Link from 'next/link';
import { Image } from '@heroui/image';
import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@heroui/button';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSideBarOpen, setSideBarOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`shadow p-4 h-20vh sticky top-0 z-[9999] transition-all duration-300 ${
        isScrolled ? 'bg-[#10275b]' : 'bg-transparent'
      }`}>
      <div className='flex w-full items-center justify-between text-2xl'>
        <Link href='/'>
          <Image src={'/tnsd_logo.png'} alt='logo' width={100} />
        </Link>

        <div className='hidden justify-self-start md:flex space-x-4 '>
          <Link href='/about' className='hover:text-[#dfff4f]'>
            About
          </Link>
          <Link href='/merch' className='hover:text-[#dfff4f]'>
            Merch
          </Link>
          <Link href='/contact' className='hover:text-[#dfff4f]'>
            Contact
          </Link>
        </div>

        <div className=''>
          <Link href='/courtBooking' className='hover:text-[#dfff4f]'>
            Courts
          </Link>
        </div>
        {/* Mobile Menu Button */}
        <Menu
          className='w-6 h-6 p-0 m-0 md:hidden hover:text-[#dfff4f]'
          onClick={() => setSideBarOpen(true)}
        />

        {/* Side Drawer for Mobile */}
        <div
          className={`fixed top-0 right-0 h-screen w-64 bg-blue shadow-lg transform transition-transform duration-300 z-9999 ${
            isSideBarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className='p-4 flex justify-end items-center'>
            <button onClick={() => setSideBarOpen(false)}>
              <X className='w-6 h-6 text-yellowski' />
            </button>
          </div>
          <div className='flex flex-col p-4 text-lg gap-4'>
            <Link href='/' onClick={() => setSideBarOpen(false)}>
              Home
            </Link>
            <Link href='/about' onClick={() => setSideBarOpen(false)}>
              About
            </Link>
            <Link href='/camps' onClick={() => setSideBarOpen(false)}>
              Camps
            </Link>
            <Link href='/contact' onClick={() => setSideBarOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
