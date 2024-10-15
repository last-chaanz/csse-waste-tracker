// src/components/Auth/ForgotPasswordForm.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const ForgotPasswordForm = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/forgot-password', { email });
            setMessage('Check your email for the password reset link.');
            setTimeout(() => {
                navigate('/'); // Navigate to login page after 3 seconds
            }, 3000);
        } catch (error) {
            setMessage('Error sending reset link: ' + (error.response?.data?.message || 'An error occurred.'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg">
            <h2 className="text-xl mb-4">Forgot Password</h2>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                className="border p-2 w-full mb-2" 
                required 
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded">Send Reset Link</button>
            {message && <p className="mt-4 text-center">{message}</p>}
        </form>
    );
};

export default ForgotPasswordForm;
