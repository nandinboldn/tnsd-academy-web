// --- components/Footer.tsx ---
export default function Footer() {
  return (
    <footer className='text-white text-center py-4'>
      <p>
        &copy; {new Date().getFullYear()} TNSD Academy. All rights reserved.
      </p>

      <p>
        Made by{' '}
        <a href='https://nandinboldn.github.io/' className='text-blue'>
          Nandinbold N.
        </a>
      </p>
    </footer>
  );
}
