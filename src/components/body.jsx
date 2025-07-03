import { Outlet } from 'react-router';
import React from 'react';
import MainNavbar from './NavBar';
import Footer from './footer';
import AutoSync from './AutoSync';
import { useUser, useAuth } from '@clerk/clerk-react';

// Clerk Session Monitor
const ClerkSessionMonitor = () => {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();

  React.useEffect(() => {
    console.log("🔐 Clerk Session Monitor:");
    console.log("Session State:", {
      isLoaded,
      isSignedIn,
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.emailAddresses?.[0]?.emailAddress
    });

    // Check for session restoration issues
    if (isLoaded && !isSignedIn) {
      console.log("⚠️ Clerk loaded but user is not signed in - possible session loss");
    }
    
    if (isLoaded && isSignedIn && !user) {
      console.log("⚠️ Clerk says signed in but no user object - possible session corruption");
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
};

const Body = () => {
  const { isLoaded } = useUser();

  // Show loading while Clerk loads
  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClerkSessionMonitor />
      <MainNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
