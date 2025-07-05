import React from 'react';


export default async function Container({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className='mx-auto max-w-3xl px-5'>
    {children}
  </div>;
}

