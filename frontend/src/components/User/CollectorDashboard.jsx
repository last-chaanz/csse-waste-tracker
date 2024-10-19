import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import LoginImage from '../../components/Auth/images/logoImage.jpg'; // Ensure the path is correct

const GarbageCollectorDashboard = ({ onLogout }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', phone: '' });
    const token = localStorage.getItem('token');

    // Fetch user data
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
                        Authorization: `${token}`,
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
    }, [token]);

    // Tips array for user engagement
    const tips = [
        { title: '🌱 Keep Your Waste Separated', content: 'Separate recyclables from general waste to help the environment and promote recycling.' },
        { title: '🧼 Regular Cleaning', content: 'Clean your bins regularly to prevent odors and pests and keep your environment fresh.' },
        { title: '📅 Stay Informed', content: 'Stay updated on local waste management regulations and best practices for effective waste disposal.' },
        { title: '🍏 Healthy Living', content: 'Maintain a healthy lifestyle by staying active, eating clean, and being mindful of your surroundings.' },
        { title: '🌍 Community Involvement', content: 'Participate in community clean-up events to help keep your neighborhood clean and vibrant.' },
        { title: '♻️ Sustainable Practices', content: 'Adopt sustainable practices at home to reduce waste and promote health in your community.' },
    ];

    // Cycling through tips
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Handle user logout
    const handleLogout = () => {
        onLogout();
        localStorage.removeItem('user');
        navigate('/');
    };

    // Update user profile
    const handleUpdateUser = async () => {
        try {
            if (!token) {
                setError('No token found. Please login.');
                return;
            }
            const response = await axios.put('http://localhost:4000/api/auth/user', updatedUser, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            if (response.status === 200) {
                alert('Profile updated successfully!');
                setShowUpdateModal(false);
                setUser(updatedUser);
            } else {
                alert('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
        }
    };

    // Sample data for charts
    const barData = {
        labels: ['Food Bin', 'Recyclable Bin', 'Non-Recyclable Bin', 'Organi Bin'],
        datasets: [
            {
                label: 'Garbage Collected (kg)',
                data: [65, 59, 80, 81],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const pieData = {
        labels: ['Recyclable', 'Non-Recyclable', 'Organic'],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
        ],
    };

    // Loading state
    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-gray-100">Loading...</div>;
    }

    // Error state
    if (error) {
        return <div className="flex h-screen items-center justify-center bg-gray-100 text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-grow">
                {/* Sidebar */}
                <aside className="flex flex-col w-64 bg-blue-800 text-white shadow-lg">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-center">Collector Dashboard</h2>
                    </div>
                    <nav className="flex-grow">
                        <ul>
                            <li className="p-4 hover:bg-blue-600 cursor-pointer" onClick={() => window.location.reload()}>Dashboard</li>
                            <li className="p-4 hover:bg-blue-600 cursor-pointer" onClick={() => navigate('/register-bin')}>Register Bin</li>
                            <li className="p-4 hover:bg-blue-600 cursor-pointer" onClick={() => navigate('/collection-schedule')}>Collection Schedule</li>
                            <li className="p-4 hover:bg-blue-600 cursor-pointer" onClick={() => navigate('/payments')}>Payments</li>
                            <li className="p-4 hover:bg-red-600 cursor-pointer" onClick={handleLogout}>Logout</li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex flex-col flex-grow">
                    {/* Header */}
                    <header className="bg-white p-4 shadow-md">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center space-x-3">
                                <img src={LoginImage} alt="Logo" className="w-16 h-16" />
                                <h1 className="text-2xl font-bold">CountryClean.LK</h1>
                            </div>
                            <div className="flex items-center space-x-3 mt-2">
                                <Avatar name={user.name || 'User'} size="40" round={true} />
                                <h2 className="text-lg font-semibold">Hi, {user.name || 'User'}</h2>
                            </div>
                        </div>
                    </header>

                    {/* Body */}
                    <main className="flex-grow overflow-y-auto p-6 bg-gray-100">
                        {/* Analytical Views */}
                        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-lg bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <h3 className="mb-4 text-lg font-semibold">Total Bins Registered</h3>
                                <p className="text-2xl font-bold text-blue-600">120</p>
                            </div>
                            <div className="rounded-lg bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <h3 className="mb-4 text-lg font-semibold">Garbage Collected This Month (kg)</h3>
                                <p className="text-2xl font-bold text-blue-600">2450 kg</p>
                            </div>
                            <div className="rounded-lg bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <h3 className="mb-4 text-lg font-semibold">Pending Bin Registrations</h3>
                                <p className="text-2xl font-bold text-blue-600">5</p>
                            </div>
                        </section>

                        {/* Charts */}
                        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-lg bg-white p-6 shadow-lg">
                                <h3 className="mb-4 text-lg font-semibold text-center">Garbage Collected Per Bin</h3>
                                <Bar data={barData} options={{ responsive: true }} />
                            </div>
                            <div className="rounded-lg bg-white p-6 shadow-lg">
                                <h3 className="mb-4 text-lg font-semibold text-center">Waste Type Distribution</h3>
                                <Pie data={pieData} options={{ responsive: true }} />
                            </div>
                        </section>

                        {/* User Tips */}
                        <section className="mt-8 rounded-lg bg-white p-6 shadow-lg">
                            <h3 className="mb-4 text-lg font-semibold">Tip of the Moment</h3>
                            <div className="font-medium">
                                <h4 className="text-lg">{tips[currentTipIndex].title}</h4>
                                <p>{tips[currentTipIndex].content}</p>
                            </div>
                        </section>

                        {/* Update Profile Modal */}
                        {showUpdateModal && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                <div className="bg-white rounded-lg p-6 w-80">
                                    <h3 className="text-lg font-semibold mb-4">Update Profile</h3>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="mb-2 p-2 border rounded w-full"
                                        value={updatedUser.name}
                                        onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="mb-2 p-2 border rounded w-full"
                                        value={updatedUser.email}
                                        onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Phone"
                                        className="mb-2 p-2 border rounded w-full"
                                        value={updatedUser.phone}
                                        onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })}
                                    />
                                    <div className="flex justify-between mt-4">
                                        <button className="bg-blue-500 text-white p-2 rounded" onClick={handleUpdateUser}>Update</button>
                                        <button className="bg-gray-300 p-2 rounded" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-blue-800 text-white py-4">
                <div className="container mx-auto text-center">
                    <p>© {new Date().getFullYear()} CountryClean.LK. All Rights Reserved.</p>
                    <p className="mt-2">Follow us on:</p>
                    <div className="flex justify-center space-x-4 mt-2">
                        <a href="#" className="hover:text-blue-400">Facebook</a>
                        <a href="#" className="hover:text-blue-400">Twitter</a>
                        <a href="#" className="hover:text-blue-400">Instagram</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default GarbageCollectorDashboard;
 
