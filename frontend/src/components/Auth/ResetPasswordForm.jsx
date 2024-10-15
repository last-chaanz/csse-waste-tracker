// src/components/Auth/ResetPasswordForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPasswordForm = () => {
    const { token } = useParams(); // Get the token from the URL
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/reset-password/${token}`, { password });
            setMessage('Password has been reset successfully.');
        } catch (error) {
            setMessage('Error resetting password: ' + (error.response?.data?.message || 'An error occurred.'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg">
            <h2 className="text-xl mb-4">Reset Password</h2>
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter new password" 
                className="border p-2 w-full mb-2" 
                required 
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded">Reset Password</button>
            {message && <p className="mt-4 text-center">{message}</p>}
        </form>
    );
};

export default ResetPasswordForm;
