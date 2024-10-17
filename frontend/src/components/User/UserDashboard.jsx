/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar'; // Import the Avatar component
import axios from 'axios';

const UserDashboard = ({ onLogout }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({ name: '', address: '' });
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
        try {
            if (!token) {
                setError('No token found. Please login.');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:4000/api/auth/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(response.data);
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to fetch user data');
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    const tips = [
        {
            title: '🌱 Keep Your Waste Separated',
            content: 'Separate recyclables from general waste to help the environment and promote recycling.',
        },
        {
            title: '🧼 Regular Cleaning',
            content: 'Clean your bins regularly to prevent odors and pests and keep your environment fresh.',
        },
        {
            title: '📅 Stay Informed',
            content: 'Stay updated on local waste management regulations and best practices for effective waste disposal.',
        },
        {
            title: '🍏 Healthy Living',
            content: 'Maintain a healthy lifestyle by staying active, eating clean, and being mindful of your surroundings.',
        },
        {
            title: '🌍 Community Involvement',
            content: 'Participate in community clean-up events to help keep your neighborhood clean and vibrant.',
        },
        {
            title: '♻️ Sustainable Practices',
            content: 'Adopt sustainable practices at home to reduce waste and promote health in your community.',
        },
    ];

    // Automatically change tips every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        }, 5000); // Change tip every 5 seconds

        return () => clearInterval(interval); // Clean up interval on unmount
    }, []);

    const handleLogout = () => {
        onLogout(); // Trigger the logout function
        localStorage.removeItem('user'); // Remove user data from localStorage
        navigate('/'); // Redirect to login page
    };

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-lg text-red-500">Error: No user data found. Please log in again.</div>
            </div>
        );
    }

    const handleUpdateUser = async () => {
        try {
            if (!token) {
                setError('No token found. Please login.');
                setLoading(false);
                return;
            }
            const response = await axios.put(`http://localhost:4000/api/auth/user`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`, // Make sure to include 'Bearer' if needed by your API
                },
            });

            if (response.status === 200) {
                alert('Profile updated successfully!'); // Show success message
                setShowUpdateModal(false);
                fetchUser();
            } else {
                alert('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
        }
    };

    return (
        <div className="flex h-screen flex-col bg-gray-100">
            {/* Header Section */}
            <header className="flex items-center justify-between bg-white p-4 shadow-md">
                <div className="flex items-center">
                    <Avatar name={user.name || 'User'} size="40" round={true} className="mr-3" />
                    <h1 className="text-xl font-bold">Hi {user.name || 'User'}</h1>
                    {/* Dropdown for Profile Settings */}
                    <div className="relative ml-3 inline-block text-left">
                        <div>
                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                                onClick={() => setShowUpdateModal(true)}
                            >
                                ⚙️
                                <svg
                                    className="-mr-1 ml-2 h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="rounded bg-red-500 px-4 py-2 text-white transition duration-300 hover:bg-red-600"
                >
                    Logout
                </button>
            </header>

            {/* Body Section */}
            <main className="flex-grow overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Waste Bin Registration Card */}
                    <div className="transform rounded-lg bg-white p-8 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
                        <h2 className="mb-4 text-lg font-semibold">Manage Waste Bin</h2>
                        <p className="text-base text-gray-700">Register your waste bin to schedule collections efficiently.</p>
                        <button
                            onClick={() => navigate('/FetchBin')}
                            className="mt-4 rounded bg-blue-500 px-6 py-3 text-lg text-white transition duration-300 hover:bg-blue-600"
                        >
                            Manage Bin
                        </button>
                    </div>

                    {/* Collection Schedule Card */}
                    <div className="transform rounded-lg bg-white p-8 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
                        <h2 className="mb-4 text-lg font-semibold">Collection Schedule</h2>
                        <p className="text-base text-gray-700">View your upcoming garbage collection schedule easily:</p>
                        <button
                            onClick={() => navigate('/additional-pickups')}
                            className="mt-4 rounded bg-green-500 px-6 py-3 text-lg text-white transition duration-300 hover:bg-green-600"
                        >
                            View Schedule
                        </button>
                    </div>

                    {/* Payment Card */}
                    <div className="transform rounded-lg bg-white p-8 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
                        <h2 className="mb-4 text-lg font-semibold">Payment</h2>
                        <p className="text-base text-gray-700">Manage your garbage collection payments conveniently:</p>
                        <button
                            onClick={() => navigate('/payments')}
                            className="mt-4 rounded bg-yellow-500 px-6 py-3 text-lg text-white transition duration-300 hover:bg-yellow-600"
                        >
                            Go to Payments
                        </button>
                    </div>
                </div>

                {/* Cleanliness and Health Tips Section */}
                <section className="mt-8 rounded-lg bg-gray-50 p-6 shadow-md">
                    <h2 className="mb-4 text-center text-2xl font-bold">🌟 Cleanliness & Health Tips</h2>
                    <div className="transform rounded-lg bg-white p-6 shadow-lg transition-transform hover:shadow-2xl">
                        <h3 className="mb-3 text-xl font-semibold">{tips[currentTipIndex].title}</h3>
                        <p className="text-lg text-gray-700">{tips[currentTipIndex].content}</p>
                    </div>
                </section>

                {/* Community Initiatives Section */}
                <section className="mt-10">
                    <h2 className="mb-4 text-lg font-semibold">Community Initiatives</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
                            <h3 className="mb-2 text-xl font-semibold">🌍 Participate in Community Clean-Up Days</h3>
                            <p className="text-gray-700">
                                Join us for our upcoming clean-up days and make a difference in your community!
                            </p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
                            <h3 className="mb-2 text-xl font-semibold">🍏 Healthy Living Workshops</h3>
                            <p className="text-gray-700">Attend our workshops on healthy living, nutrition, and wellness.</p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
                            <h3 className="mb-2 text-xl font-semibold">♻️ Recycling Drives</h3>
                            <p className="text-gray-700">Get involved in our recycling drives to promote sustainability!</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Section */}
            <footer className="bg-white p-4 text-center shadow-md">
                <p className="text-gray-600">&copy; {new Date().getFullYear()} CountryClean. All rights reserved.</p>
                <p className="text-gray-600">
                    Contact us:{' '}
                    <a href="mailto:support@example.com" className="text-blue-500">
                        support@countryclean.com
                    </a>
                </p>
            </footer>

            {/* Update User Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                        <h2 className="mb-4 text-2xl font-semibold">Update Your Information</h2>
                        <label className="mb-2 block">
                            Name:
                            <input
                                type="text"
                                value={updatedUser.name}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                                className="mt-1 block w-full rounded border p-2"
                                placeholder="Enter your name"
                            />
                        </label>
                        <label className="mb-2 block">
                            Address:
                            <input
                                type="text"
                                value={updatedUser.address}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, address: e.target.value })}
                                className="mt-1 block w-full rounded border p-2"
                                placeholder="Enter your address"
                            />
                        </label>
                        {/* <label className="block mb-2">
                            Email:
                            <input 
                                type="email" 
                                value={updatedUser.email} 
                                onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })} 
                                className="block w-full border rounded p-2 mt-1" 
                                placeholder="Enter your email"
                            />
                        </label> */}
                        {/* <label className="block mb-2">
                            Phone:
                            <input 
                                type="tel" 
                                value={updatedUser.phone} 
                                onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })} 
                                className="block w-full border rounded p-2 mt-1" 
                                placeholder="Enter your phone number"
                            />
                        </label> */}
                        <div className="mt-4 flex justify-end gap-x-2">
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="rounded bg-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateUser}
                                className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
