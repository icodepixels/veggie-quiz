'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Category } from '../types';
import SignUpModal from './SignUpModal';

interface HeaderClientProps {
  categories: Category[];
}

export default function HeaderClient({ categories }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSignedUp, setHasSignedUp] = useState(false);
  const router = useRouter();

  const checkEmailStatus = () => {
    const userEmail = localStorage.getItem('userEmail');
    setHasSignedUp(!!userEmail);
  };

  useEffect(() => {
    // Check initial status
    checkEmailStatus();

    // Add event listener for email status changes
    window.addEventListener('emailStatusChanged', checkEmailStatus);

    // Cleanup
    return () => {
      window.removeEventListener('emailStatusChanged', checkEmailStatus);
    };
  }, []);

  const handleActionClick = () => {
    if (hasSignedUp) {
      router.push('/profile');
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <header className='w-full flex flex-wrap-reverse items-center'>
      <Link href="/" className="hover:opacity-90 transition-opacity">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          <Image
            src="/images/health-food-trivia-avocado-logo.png"
            alt="Veggie Quiz the Vegan Edition Logo"
            width={442/4}
            height={435/4}
            priority
            className='pr-2'
          />
          <span className='min-w-44 text-[#204642]'>Veggie Quiz</span>
        </h1>
      </Link>

      {/* Hamburger Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden ml-auto p-2 hover:bg-[#43855b]/10 rounded-lg transition-colors"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`h-0.5 w-full bg-[#2d5d3c] transition-all ${
            isMenuOpen ? 'rotate-45 translate-y-2' : ''
          }`}></span>
          <span className={`h-0.5 w-full bg-[#2d5d3c] transition-all ${
            isMenuOpen ? 'opacity-0' : ''
          }`}></span>
          <span className={`h-0.5 w-full bg-[#2d5d3c] transition-all ${
            isMenuOpen ? '-rotate-45 -translate-y-2' : ''
          }`}></span>
        </div>
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center ml-auto">
        <div className="flex space-x-6 items-center">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/quizzes/${category.name}`}
              className="hover:text-[#43855b] transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <div className="ml-8">
          <button
            onClick={handleActionClick}
            className="bg-[#43855b] text-white px-6 py-2 rounded-full hover:bg-[#2d5d3c] transition-colors"
          >
            {hasSignedUp ? 'View Profile' : 'Sign Up'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`
        fixed top-[72px] left-0 right-0 w-full lg:hidden
        px-4 z-50 max-h-[calc(100vh-72px)] overflow-y-auto
        ${isMenuOpen ? 'block' : 'hidden'}
      `}>
        <nav className="bg-white rounded-lg shadow-lg border border-[#43855b]/10">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/quizzes/${category.name}`}
              className="block px-4 py-3 hover:bg-[#43855b]/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {category.name}
            </Link>
          ))}
          <button
            onClick={() => {
              if (hasSignedUp) {
                router.push('/profile');
              } else {
                setIsModalOpen(true);
              }
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 hover:bg-[#43855b]/10 transition-colors border-t border-[#43855b]/10"
          >
            {hasSignedUp ? 'View Profile' : 'Sign Up'}
          </button>
        </nav>
      </div>

      <SignUpModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          checkEmailStatus();
        }}
      />
    </header>
  );
}