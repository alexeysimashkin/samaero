'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-lime-600 to-lime-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <svg className="w-8 h-8 transform rotate-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
            <span className="text-2xl font-bold">SamAero</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/check-in" className="hover:text-lime-200 transition">
              Онлайн-регистрация
            </Link>
            {session ? (
              <>
                <Link href="/profile" className="hover:text-lime-200 transition">
                  Личный кабинет
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-white text-lime-700 px-4 py-2 rounded-lg hover:bg-lime-100 transition"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-lime-200 transition">
                  Войти
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-white text-lime-700 px-4 py-2 rounded-lg hover:bg-lime-100 transition"
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link href="/check-in" className="hover:text-lime-200 transition">
                Онлайн-регистрация
              </Link>
              {session ? (
                <>
                  <Link href="/profile" className="hover:text-lime-200 transition">
                    Личный кабинет
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="bg-white text-lime-700 px-4 py-2 rounded-lg hover:bg-lime-100 transition text-center"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="hover:text-lime-200 transition">
                    Войти
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-white text-lime-700 px-4 py-2 rounded-lg hover:bg-lime-100 transition text-center"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
