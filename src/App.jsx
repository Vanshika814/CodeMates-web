import React from 'react';
import Body from './components/body';
import Profile from './components/profile';
import Feed from './components/Feed';
import Connections from './components/connections';
import Requests from './components/Requests';

import { Provider } from 'react-redux';
import appStore from './utils/appStore';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';

function App() {
  return (
    <Provider store={appStore}>
      <main className="dark text-foreground-50">
        <BrowserRouter>
          <Routes>
            {/* Public landing page with auth buttons */}
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <Navigate to="/feed" replace />
                  </SignedIn>
                  <SignedOut>
                    <div className="flex justify-center items-center min-h-screen bg-background">
                      <div className="text-center space-y-8">
                        <div className="space-y-4">
                          <h1 className="text-4xl font-bold text-white">Welcome to DevTinder</h1>
                          <p className="text-gray-400 text-lg">Connect with developers around the world</p>
                        </div>
                        <div className="flex gap-4 justify-center">
                          <SignInButton 
                            mode="modal"
                            fallbackRedirectUrl="/feed"
                            signInFallbackRedirectUrl="/feed"
                          >
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              Sign In
                            </button>
                          </SignInButton>
                          <SignUpButton 
                            mode="modal"
                            fallbackRedirectUrl="/feed"
                            signUpFallbackRedirectUrl="/feed"
                          >
                            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                              Sign Up
                            </button>
                          </SignUpButton>
                        </div>
                      </div>
                    </div>
                  </SignedOut>
                </>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <SignedIn>
                  <Body />
                </SignedIn>
              }
            >
              <Route path="feed" element={<Feed />} />
              <Route path="profile" element={<Profile />} />
              <Route path="connections" element={<Connections />} />
              <Route path="requests" element={<Requests />} />
            </Route>

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </main>
    </Provider>
  );
}

export default App;
