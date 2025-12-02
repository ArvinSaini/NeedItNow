import './App.css'

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './sections/Home';
import Login from './sections/Login';
import Signup from './sections/Signup';
import AllListings from './sections/AllListings';
import AllRequests from './sections/AllRequests';
import Aboutus from './sections/Aboutus';
import Dashboard from './components/Dashboard';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/listings" element={<AllListings />} />
        <Route path="/requests" element={<AllRequests />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
