import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserList from './components/Users/UserList';
import InterestList from './components/Intrests/IntrestList';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/interests" element={<InterestList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
