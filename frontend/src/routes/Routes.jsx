// src/App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/User/Navbar'; // Ensure you have this component
import LoginForm from '../components/Auth/LoginForm';
import RegistrationForm from '../components/Auth/RegistrationForm';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm';
import Dashboard from '../components/User/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from '../components/User/NotFound';

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto mt-8">
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/register" element={<RegistrationForm />} />
                    <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
                    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
