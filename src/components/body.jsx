import { Outlet } from 'react-router';
import React from 'react';
import MainNavbar from './NavBar';
import Footer from './footer';
import AutoSync from './AutoSync';
import { useUser } from '@clerk/clerk-react';

const Body = () => {
  const { isLoaded } = useUser();

  // Show loading while Clerk loads
  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AutoSync />
      <MainNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
