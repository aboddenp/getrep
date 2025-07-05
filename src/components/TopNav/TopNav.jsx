import React from 'react';
import Container from '@/components/Container'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

function TopNav() {
  return (
    <header className="flex justify-end items-center p-7 gap-4 h-16">
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <Container>
          <div className='flex'>
            <div className='ml-auto'>
              <UserButton />
            </div>
          </div>
        </Container>
      </SignedIn>
    </header>
  )
}

export default TopNav;
