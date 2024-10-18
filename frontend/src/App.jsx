import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';
import UserDashboard from './components/User/UserDashboard';
import AdminDashboard from './components/User/AdminDashboard';
import CollectorDashboard from './components/User/CollectorDashboard';

import RegisterBin from './components/WasteBin/registerBin';
import FetchBin from './components/WasteBin/fetchBin';
import CollectorBin from './components/WasteBin/collectorBin';
import NotFound from './components/User/NotFound';

import PaymentTabs from './components/payment/PaymentTabs';
import AdditionalPickupList from './pages/AdditionalPickupList';
import CollectorAdditionalPickups from './pages/CollectorAdditionalPickups';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user data from localStorage on app load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <Router>
            <div className="container mx-auto mt-8">
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/register" element={<RegistrationForm />} />
                    <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
                    <Route path="/user/dashboard" element={<UserDashboard user={user} onLogout={handleLogout} />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
                    <Route path="/collector/dashboard" element={<CollectorDashboard user={user} onLogout={handleLogout} />} />

                    <Route path="/registerBin" element={<RegisterBin />} />
                    <Route path="/fetchBin" element={<FetchBin />} />
                    <Route path="/collectorBin" element={<CollectorBin />} />

                    <Route path="/payments" element={<PaymentTabs />} />
                    <Route path="/additional-pickups" element={<AdditionalPickupList />} />
                    <Route path="/collector-additional-pickups" element={<CollectorAdditionalPickups />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

// ProtectedRoute Component
function ProtectedRoute({ user, children }) {
    if (!user) {
        return <Navigate to="/" />;
    }
    return children;
}

export default App;
