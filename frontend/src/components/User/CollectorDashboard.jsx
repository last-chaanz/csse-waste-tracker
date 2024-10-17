/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import axios from 'axios';

const GarbageCollectorDashboard = ({ onLogout }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', phone: '' });
    const token = localStorage.getItem('token');
    useEffect(() => {
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
                setUpdatedUser(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.msg || 'Failed to fetch user data');
                setLoading(false);
            }
        };
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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        onLogout();
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleUpdateUser = async () => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setShowUpdateModal(false);
        setUser(updatedUser);

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

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-lg text-blue-500">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-lg text-red-500">{error}</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-lg text-red-500">Error: No user data found. Please log in again.</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-gray-100">
            {/* Header Section */}
            <header className="flex items-center justify-between bg-white p-4 shadow-md">
                <div className="flex items-center">
                    <Avatar name={user.name || 'User'} size="40" round={true} className="mr-3" />
                    <h1 className="text-xl font-bold">Hi Collector {user.name || 'User'}</h1>
                    <button
                        type="button"
                        className="ml-3 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={() => setShowUpdateModal(true)}
                    >
                        Update Profile
                    </button>
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
                        <p className="text-base text-gray-700">Mange waste bin to schedule that are assigned to me.</p>
                        <button
                            onClick={() => navigate('/collectorBin')}
                            className="mt-4 rounded bg-blue-500 px-6 py-3 text-lg text-white transition duration-300 hover:bg-blue-600"
                        >
                            Bins assigned to me
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
            <footer className="bg-teal-500 p-4 text-center text-white">
                <p>&copy; 2024 Garbage Management. All rights reserved.</p>
            </footer>

            {/* Update Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold">Update Profile</h2>
                        <form>
                            <input
                                type="text"
                                placeholder="Name"
                                value={updatedUser.name}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                                className="mb-3 w-full rounded border p-2"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={updatedUser.email}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                                className="mb-3 w-full rounded border p-2"
                            />
                            <input
                                type="phone"
                                placeholder="Phone"
                                value={updatedUser.phone}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })}
                                className="mb-3 w-full rounded border p-2"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateModal(false)}
                                    className="mr-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUpdateUser}
                                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GarbageCollectorDashboard;
