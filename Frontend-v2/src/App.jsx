import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from './lib/api';
import Home from './sections/Home';
import AllListings from './sections/AllListings';
import AllRequests from './sections/AllRequests';
import Login from './sections/Login';
import Signup from './sections/Signup';
import Aboutus from './sections/Aboutus';
import Dashboard from './components/Dashboard';

const ProtectedRoute = ({ children }) => {
  if (!getToken()) return <Navigate to="/login" replace />;
  return children;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/listings" element={<AllListings />} />
      <Route path="/requests" element={<AllRequests />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/aboutus" element={<Aboutus />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
