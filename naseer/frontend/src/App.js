import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import './utils/i18n';
import Navbar          from './components/Navbar';
import Chatbot         from './components/Chatbot';
import GoalCelebration from './components/GoalCelebration';
import LiveFeed        from './components/LiveFeed';
import Home            from './pages/Home';
import Campaigns       from './pages/Campaigns';
import Donate          from './pages/Donate';
import Dashboard       from './pages/Dashboard';
import Admin           from './pages/Admin';
import Stories         from './pages/Stories';
import About           from './pages/About';
import Volunteer       from './pages/Volunteer';
import Verify          from './pages/Verify';
import { Receipt, Login, Register } from './pages/AuthPages';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--muted)',fontFamily:'var(--font-body)'}}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const AppInner = () => {
  const { user } = useAuth();
  return (
    <SocketProvider>
      <Navbar />
      <GoalCelebration />
      <LiveFeed />
      <Chatbot />
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/campaigns"    element={<Campaigns />} />
        <Route path="/stories"      element={<Stories />} />
        <Route path="/about"        element={<About />} />
        <Route path="/volunteer"    element={<Volunteer />} />
        <Route path="/verify/:id"   element={<Verify />} />
        <Route path="/donate/:id"   element={<Donate />} />
        <Route path="/receipt"      element={<Receipt />} />
        <Route path="/login"        element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register"     element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin"        element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        <Route path="*"             element={<Navigate to="/" />} />
      </Routes>
    </SocketProvider>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
