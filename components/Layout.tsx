// --- components/Layout.tsx ---
'use client';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className='flex flex-col'>
      {children}
      <Footer />
    </div>
  );
}
