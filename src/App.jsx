import React from 'react';
import Body from './components/body';
import Profile from './components/profile';
import Feed from './components/Feed';
import Connections from './components/connections';
import Requests from './components/Requests';
import Chat from './components/chat';
import LandingPage from './components/LandingPage';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import AutoSync from './components/AutoSync';

function App() {
  return (
    <Provider store={appStore}>
      <main className="dark text-foreground">
        <BrowserRouter>
          <AutoSync />
          <Routes>
            {/* Public landing page */}
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <Navigate to="/feed" replace />
                  </SignedIn>
                  <SignedOut>
                    <LandingPage />
                  </SignedOut>
                </>
              }
            />

            {/* All protected routes under a single persistent Body wrapper */}
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
              <Route path="chat/:targetId" element={<Chat />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </main>
    </Provider>
  );
}

export default App;
