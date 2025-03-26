'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bars3Icon,
  ChatBubbleOvalLeftEllipsisIcon,
  ShieldCheckIcon,
  HomeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ConnectBtn } from './WalletConnect';

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: 'Home',
    href: '/',
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    label: 'Consult AI',
    href: '/consult',
    icon: <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />,
  },
  {
    label: 'Clinicians',
    href: '/verified-clinicians',
    icon: <ShieldCheckIcon className="h-5 w-5" />,
  },
  {
    label: 'Join as Clinician',
    href: '/apply-clinician',
    icon: <ShieldCheckIcon className="h-5 w-5" />,
  },
  
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;

        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`btn  ${
                isActive 
                  ? 'bg-accent font-medium dark:bg-primary/50' 
                  : 'btn-primary'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {icon}
              </span>
              <span className='text-white'>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log(isLoggedIn);

  // Close drawer when route changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-impbg dark:bg-impbg-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isDrawerOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Logo and desktop navigation */}
          <div className="flex flex-1 items-center justify-between">
            <Link href="/" passHref className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  alt="Anocare logo"
                  className="cursor-pointer"
                  fill
                  src="/anocare-logo.png"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold dark:text-white text-black">Anocare</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Private AI Health Consults</span>
              </div>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex">
              <ul className="flex items-center space-x-2">
                <HeaderMenuLinks />
              </ul>
            </nav>

            {/* User profile/actions */}
            <div className="flex items-center">
            <div className="flex items-center ">
          <div>
           <ConnectBtn
            setIsLoggedIn={setIsLoggedIn}
           />
          </div>
      </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden ${isDrawerOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-1 px-2 pb-3 pt-2">
          <ul className="flex flex-col space-y-2">
            <HeaderMenuLinks />
          </ul>
        </div>
      </div>
    </header>
  );
};