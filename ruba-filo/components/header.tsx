'use client'
import { SignedOut, SignInButton, SignUpButton, SignedIn, SignOutButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, CarFront, Heart, Layout } from 'lucide-react';

const Header = ({ isAdminPage = false }: { isAdminPage?: boolean }) => {
  const isAdmin=false;
  return (
    <header className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b'>
    <nav className='mx-auto px-4 py-4 flex items-center justify-between'>

<Image src="/rubalogo_1.png" alt="Logo" width={100} height={40} className='h-12 w-auto object-contain' />
     <Link href={isAdminPage?"/admin": "/" } className='flex'>
  {
    isAdminPage&&(
      <span className='text-xs font-extralight' >admin</span>
    )
  }
</Link>


<div className='flex items-center gap-2'>
  {isAdminPage ? (
    <Button asChild className="flex items-center gap-2" variant='outline'>
      <Link href="/" aria-label="Back to app">
        <ArrowLeft size={18} />
        <span className="inline">Back to app</span>
      </Link>
    </Button>
  ) : (
    <SignedIn>
      <Button asChild className="flex items-center gap-2">
        <Link href="/saved-cars" aria-label="Saved Cars">
          <Heart size={18} />
          <span className="inline">Saved Cars</span>
        </Link>
      </Button>

      {!isAdmin ? (
        <Button asChild variant="outline" className="flex items-center gap-2 text-foreground">
          <Link href="/reservations" >
            <CarFront size={18} /> 
            <span className="inline">My reservations</span>
          </Link>
        </Button>
      ) : (
        <Button asChild variant="outline" className="flex items-center gap-2 text-foreground">
          <Link href="/admin" >
            <Layout size={18} />
            <span className="inline">Admin</span>
          </Link>
        </Button>
      )}
    </SignedIn>
  )}

 
  <SignedOut>
    <SignInButton forceRedirectUrl="/">
      <Button variant='outline'>Login</Button>
    </SignInButton>
  </SignedOut>

  <SignedIn>
    <UserButton
      appearance={{
        elements: {
          // Button wrapper
          userButtonTrigger: "w-10 h-10 p-0",
          // Avatar container
          avatarBox: "w-10 h-10",
          // Avatar image inside
          avatarImage: "w-10 h-10",
        },
      }}
    />
  </SignedIn>
</div>

    </nav>
  

    </header>
  );
};

export default Header;