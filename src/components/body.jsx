import { Outlet, useLocation } from 'react-router';
import React from 'react';
import MainNavbar from './NavBar';
import Footer from './footer';
import AutoSync from './AutoSync';
import { useUser, useAuth } from '@clerk/clerk-react';
import {CircularProgress} from "@heroui/react";

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
  const location = useLocation();
  
  // Check if current route is a chat page
  const isChatPage = location.pathname.startsWith('/chat');

  // Show loading while Clerk loads
  if (!isLoaded) {
    return <CircularProgress aria-label="Loading..." size="lg" color="secondary"/>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClerkSessionMonitor />
      <MainNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
};

export default Body;
