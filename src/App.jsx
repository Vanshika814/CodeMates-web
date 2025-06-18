import React from 'react';
import Body from './components/body';
import Login from './components/login';
import Profile from './components/profile';
import Feed from './components/Feed';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';

import { BrowserRouter, Routes, Route } from 'react-router';
function App() {
  return (
    <Provider store={appStore}>
    <main className="dark text-foreground bg-background">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />} >
            <Route path="/" element={<Feed />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
    </Provider>
  );
}

export default App;
