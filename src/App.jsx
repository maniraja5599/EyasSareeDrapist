import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import NotificationListener from './components/NotificationListener';
import './index.css';
import { useState } from 'react';

// Customer Pages
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import PaymentPage from './pages/PaymentPage';
import ClientLogin from './pages/ClientLogin';
import ClientProfile from './pages/ClientProfile';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReports from './pages/admin/AdminReports';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminPartners from './pages/admin/AdminPartners';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSettings from './pages/admin/AdminSettings';
import AdminRecycleBin from './pages/admin/AdminRecycleBin';

// Components
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import FloatingSocials from './components/FloatingSocials';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}

      <AuthProvider>
        <ToastProvider>
          <NotificationListener />
          <Router basename={import.meta.env.BASE_URL}>
            <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white pb-16 md:pb-0">
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={
                  <>
                    <Navbar />
                    <LandingPage />
                  </>
                } />
                <Route path="/book" element={
                  <>
                    <Navbar />
                    <BookingPage />
                  </>
                } />
                <Route path="/track" element={
                  <>
                    <Navbar />
                    <TrackingPage />
                  </>
                } />
                <Route path="/track/:bookingId" element={
                  <>
                    <Navbar />
                    <TrackingPage />
                  </>
                } />
                <Route path="/pay/:bookingId" element={
                  <>
                    <Navbar />
                    <PaymentPage />
                  </>
                } />
                <Route path="/payment/:bookingId" element={
                  <>
                    <Navbar />
                    <PaymentPage />
                  </>
                } />
                <Route path="/login" element={
                  <>
                    <Navbar />
                    <ClientLogin />
                  </>
                } />

                <Route path="/profile" element={
                  <>
                    <Navbar />
                    <ClientProfile />
                  </>
                } />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <ProtectedRoute>
                    <AdminReports />
                  </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute>
                    <AdminOrders />
                  </ProtectedRoute>
                } />
                <Route path="/admin/customers" element={
                  <ProtectedRoute>
                    <AdminCustomers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/partners" element={
                  <ProtectedRoute>
                    <AdminPartners />
                  </ProtectedRoute>
                } />
                <Route path="/admin/payments" element={
                  <ProtectedRoute>
                    <AdminPayments />
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute>
                    <AdminSettings />
                  </ProtectedRoute>
                } />
                <Route path="/admin/recycle-bin" element={
                  <ProtectedRoute>
                    <AdminRecycleBin />
                  </ProtectedRoute>
                } />
              </Routes>
              <BottomNav />
              <FloatingSocials />
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </>
  );
}

export default App;
