import React from 'react';
import Body from './body';
import Login from './login';
import Profile from './profile';

import { BrowserRouter, Routes, Route } from 'react-router';
function App() {
  return (
    <main className="dark text-foreground bg-background">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
