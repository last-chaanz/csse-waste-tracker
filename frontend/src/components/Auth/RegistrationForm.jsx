import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// InputField Component
const InputField = ({ label, type, name, value, onChange, placeholder, error }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : null}
            className={`border p-2 w-full rounded focus:outline-none focus:ring ${
                error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={placeholder}
        />
        {error && (
            <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
                {error}
            </p>
        )}
    </div>
);

// Success Message Component
const SuccessMessage = ({ message }) => (
    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
        {message}
    </div>
);

// Error Message Component
const ErrorMessage = ({ message }) => (
    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
        {message}
    </div>
);

// RegistrationForm Component
const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        userType: 'residence', // Default userType
        role: 'user' // Assuming 'user' role by default
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Create navigate function

    // Reset form data when component mounts
    useEffect(() => {
        setFormData({
            name: '',
            email: '',
            password: '',
            address: '',
            userType: 'residence',
            role: 'user'
        });
    }, []); // Empty dependency array means this runs once on mount

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Client-side validation
    const validateForm = () => {
        const newErrors = {};
        const { name, email, password, address } = formData;

        if (!name) newErrors.name = 'Name is required';
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(password)) {
            newErrors.password = 'Password must contain both letters and numbers';
        }
        if (!address) newErrors.address = 'Address is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:4000/api/auth/register', formData);
            setSuccessMessage('Registration successful! Please verify your email.');
            // Reset form data after successful registration
            setFormData({
                name: '',
                email: '',
                password: '',
                address: '',
                userType: 'residence',
                role: 'user'
            });
            navigate('/'); // Navigate to the home or login page
        } catch (error) {
            setErrors({
                submit: error.response?.data?.msg || 'Registration failed',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-8 max-w-md w-full border border-gray-200"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

                {successMessage && <SuccessMessage message={successMessage} />}
                {errors.submit && <ErrorMessage message={errors.submit} />}

                {/* Name Input */}
                <InputField
                    label="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    error={errors.name}
                />

                {/* Email Input */}
                <InputField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    error={errors.email}
                />

                {/* Password Input */}
                <InputField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    error={errors.password}
                />

                {/* Address Input */}
                <InputField
                    label="Address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    error={errors.address}
                />

                {/* User Type Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Type
                    </label>
                    <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="border p-2 w-full rounded focus:outline-none focus:ring border-gray-300"
                    >
                        <option value="residence">Residence</option>
                        <option value="business">Business</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full bg-blue-500 text-white p-2 rounded focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;
