import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LazyMotion } from 'framer-motion';
import { getToken } from './lib/api';
import useSessionWatch from './lib/useSessionWatch';
import Home from './sections/Home';
import Spinner from './components/ui/Spinner';

const AllListings = lazy(() => import('./sections/AllListings'));
const AllRequests = lazy(() => import('./sections/AllRequests'));
const Login = lazy(() => import('./sections/Login'));
const Signup = lazy(() => import('./sections/Signup'));
const Aboutus = lazy(() => import('./sections/Aboutus'));
const Dashboard = lazy(() => import('./components/Dashboard'));

const loadMotionFeatures = () => import('./lib/motionFeatures').then((mod) => mod.default);

const ProtectedRoute = ({ children }) => {
  if (!getToken()) return <Navigate to="/login" replace />;
  return children;
};

const SessionWatcher = () => {
  useSessionWatch();
  return null;
};

const App = () => (
  <LazyMotion features={loadMotionFeatures} strict>
    <BrowserRouter>
      <SessionWatcher />
      <Suspense fallback={<Spinner />}>
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
      </Suspense>
    </BrowserRouter>
  </LazyMotion>
);

export default App;
