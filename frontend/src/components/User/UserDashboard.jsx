import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardImage from '../../assets/dash-imagess.png'; 
import NavBar from '../common/Navbar';
import Footer from '../common/Footer';

export const UpdateUserModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [name, setName] = useState(user.name || '');
    const [address, setAddress] = useState(user.address || '');

    const handleUpdate = () => {
        onUpdate({ name, address });
        onClose(); // Close modal after update
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-bold">Update User Information</h2>
                <div className="mb-4">
                <label htmlFor="userName">Name</label>
                <input
                    id="userName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                </div>
                <div className="mb-4">
                <label htmlFor="userAddress">Address</label>
                <input
                    id="userAddress"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-2 rounded bg-gray-300 px-4 py-2 transition hover:bg-gray-400">
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

const UserDashboard = ({ onLogout }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());
    const [statistics, setStatistics] = useState({
        totalCollections: 0,
        totalBins: 0,
        garbageCollected: 0,
        collectionsThisMonth: 0,
    });
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
        try {
            if (!token) {
                setError('No token found. Please login.');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:4000/api/auth/user', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to fetch user data');
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/statistics', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchStatistics();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date().toLocaleString());
        }, 1000);

        return () => clearInterval(interval);
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

    const handleLogout = () => {
        onLogout();
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleUpdateUser = async (updatedUser) => {
        try {
            if (!token) {
                setError('No token found. Please login.');
                setLoading(false);
                return;
            }
            const response = await axios.put('http://localhost:4000/api/auth/user', updatedUser, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                alert('Profile updated successfully!');
                fetchUser(); // Refresh user data
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
                <div className="text-lg text-gray-500">Loading user data...</div>
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
        <div className="flex h-screen flex-col">
            {/* Navigation Bar */}
            <NavBar handleLogout={handleLogout} />

            {/* Main Content */}
            {/* <div className="flex flex-1 bg-gray-100">
                <main className="flex-1 p-6"> */}
            {/* <header className="flex items-center justify-between rounded-md bg-gray-100 px-6 py-4 shadow-md">
                        <div className="flex items-center space-x-4"> */}
            {/* User Avatar and Greeting */}
            {/* <Avatar name={user.name || 'User'} size="40" round={true} />
                            <h1 className="text-xl font-medium text-gray-800 dark:text-white">{`Hi, ${user.name || 'User'}`}</h1>
                            <button
                                onClick={() => setShowUpdateModal(true)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-300 dark:hover:text-gray-500"
                                type="button"
                            >
                                <HiOutlineCog className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="hidden items-center text-sm text-gray-500 dark:text-gray-300 sm:flex">
                            <p>{currentDateTime}</p>
                        </div>
                    </header> */}
            <br></br>
            <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-[75px] p-6 lg:p-10">
                <div className="flex flex-col items-center lg:items-start justify-center gap-4">
                    <span className="mt-10 lg:mt-20 text-2xl lg:text-3xl font-bold tracking-wide text-sky-900 text-center lg:text-left">
                        Start Your <span className="text-xl lg:text-2xl font-bold text-green-500">Waste Management</span> Journey Here
                    </span>
                    <button
                        onClick={() => navigate('/FetchBin')}
                        className="hover:text-gray rounded-xl border-2 border-sky-900 px-6 lg:px-8 py-2 text-base lg:text-lg hover:border-4"
                    >
                        Click Here
                    </button>
                </div>
                <img src={DashboardImage} alt="Dashboard" className="w-full lg:w-3/4 rounded-lg border-b-4 mt-6 lg:mt-0" />
            </div>

            {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <h3 className="text-lg font-semibold">Manage Your Bin</h3>
                            <p className="text-gray-600">Manage your waste bin and schedule pickups.</p>
                            <button
                                onClick={() => navigate('/FetchBin')}
                                className="mt-4 block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            >
                                Manage Your Bin
                            </button>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <h3 className="text-lg font-semibold">Collection Schedule</h3>
                            <p className="text-gray-600">Check the collection schedule for your area.</p>
                            <button
                                onClick={() => navigate('/additional-pickups')}
                                className="mt-4 block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            >
                                View Schedule
                            </button>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <h3 className="text-lg font-semibold">Payments</h3>
                            <p className="text-gray-600">Manage your payments for waste collection services.</p>
                            <button
                                onClick={() => navigate('/payments')}
                                className="mt-4 block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            >
                                Go to Payments
                            </button>
                        </div>
                    </div> */}

            {/* Statistics Section */}
            {/* <section className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-lg font-bold">Total Collections</h2>
                            <p className="text-xl">{statistics.totalCollections}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-lg font-bold">Total Bins</h2>
                            <p className="text-xl">{statistics.totalBins}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-lg font-bold">Garbage Collected</h2>
                            <p className="text-xl">{statistics.garbageCollected} Kg</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-lg font-bold">Collections This Month</h2>
                            <p className="text-xl">{statistics.collectionsThisMonth}</p>
                        </div>
                    </section> */}

            {/* Tips Section */}
            {/* <section className="mt-6 rounded-lg bg-white p-4 shadow">
                        <h2 className="text-lg font-bold">Tip of the Moment</h2>
                        <div className="mt-2">
                            <h3 className="text-md font-semibold">{tips[currentTipIndex]?.title}</h3>
                            <p className="text-sm text-gray-600">{tips[currentTipIndex]?.content}</p>
                        </div>
                    </section> */}
            {/* </main>
            </div> */}

            {/* Footer */}
            <Footer />

            {/* Update User Modal */}
            <UpdateUserModal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                user={user}
                onUpdate={handleUpdateUser}
            />
        </div>
    );
};

export default UserDashboard;
