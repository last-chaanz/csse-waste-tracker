// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Avatar from 'react-avatar';
// import axios from 'axios';
// import { HiOutlineCog } from 'react-icons/hi'; // Import a settings icon

// const UpdateUserModal = ({ isOpen, onClose, user, onUpdate }) => {
//     const [name, setName] = useState(user.name || '');
//     const [address, setAddress] = useState(user.address || '');

//     const handleUpdate = () => {
//         onUpdate({ name, address });
//         onClose(); // Close modal after update
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <h2 className="text-2xl font-bold mb-4">Update User Information</h2>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Name</label>
//                     <input
//                         type="text"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Address</label>
//                     <input
//                         type="text"
//                         value={address}
//                         onChange={(e) => setAddress(e.target.value)}
//                         className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
//                     />
//                 </div>
//                 <div className="flex justify-end">
//                     <button onClick={onClose} className="mr-2 rounded bg-gray-300 px-4 py-2">Cancel</button>
//                     <button onClick={handleUpdate} className="rounded bg-blue-500 px-4 py-2 text-white">Update</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const UserDashboard = ({ onLogout }) => {
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [currentTipIndex, setCurrentTipIndex] = useState(0);
//     const [showUpdateModal, setShowUpdateModal] = useState(false);
//     const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());
//     const token = localStorage.getItem('token');

//     const fetchUser = async () => {
//         try {
//             if (!token) {
//                 setError('No token found. Please login.');
//                 setLoading(false);
//                 return;
//             }

//             const response = await axios.get('http://localhost:4000/api/auth/user', {
//                 headers: {
//                     Authorization: `${token}`,
//                 },
//             });

//             setUser(response.data);
//             setLoading(false);
//         } catch (error) {
//             setError(error.response?.data?.msg || 'Failed to fetch user data');
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUser();
//     }, []);

//     // Automatically change tips every 5 seconds
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
//         }, 5000);

//         return () => clearInterval(interval);
//     }, []);

//     // Update current date and time every second
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentDateTime(new Date().toLocaleString());
//         }, 1000);

//         return () => clearInterval(interval);
//     }, []);

//     const tips = [
//         {
//             title: '🌱 Keep Your Waste Separated',
//             content: 'Separate recyclables from general waste to help the environment and promote recycling.',
//         },
//         {
//             title: '🧼 Regular Cleaning',
//             content: 'Clean your bins regularly to prevent odors and pests and keep your environment fresh.',
//         },
//         {
//             title: '📅 Stay Informed',
//             content: 'Stay updated on local waste management regulations and best practices for effective waste disposal.',
//         },
//         {
//             title: '🍏 Healthy Living',
//             content: 'Maintain a healthy lifestyle by staying active, eating clean, and being mindful of your surroundings.',
//         },
//         {
//             title: '🌍 Community Involvement',
//             content: 'Participate in community clean-up events to help keep your neighborhood clean and vibrant.',
//         },
//         {
//             title: '♻️ Sustainable Practices',
//             content: 'Adopt sustainable practices at home to reduce waste and promote health in your community.',
//         },
//     ];

//     const handleLogout = () => {
//         onLogout();
//         localStorage.removeItem('user');
//         navigate('/');
//     };

//     const handleUpdateUser = async (updatedUser) => {
//         try {
//             if (!token) {
//                 setError('No token found. Please login.');
//                 setLoading(false);
//                 return;
//             }
//             const response = await axios.put('http://localhost:4000/api/auth/user', updatedUser, {
//                 headers: {
//                     Authorization: `${token}`,
//                 },
//             });

//             if (response.status === 200) {
//                 alert('Profile updated successfully!');
//                 fetchUser(); // Refresh user data
//             } else {
//                 alert('Failed to update profile. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error updating profile:', error);
//             alert('An error occurred while updating the profile.');
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex h-screen items-center justify-center bg-gray-100">
//                 <div className="text-lg text-gray-500">Loading user data...</div>
//             </div>
//         );
//     }

//     if (!user) {
//         return (
//             <div className="flex h-screen items-center justify-center bg-gray-100">
//                 <div className="text-lg text-red-500">Error: No user data found. Please log in again.</div>
//             </div>
//         );
//     }

//     return (
//         <div className="flex h-screen">
//             {/* Sidebar */}
//             <aside className="flex flex-col p-4 space-y-4 bg-white shadow-md rounded-md w-64">
//                 <h2 className="text-2xl font-bold text-center">CountryClean.LK</h2>
//                 <div className="flex flex-col space-y-2">
//                     <button
//                         onClick={() => navigate('/FetchBin')}
//                         className="block w-full rounded-md bg-gray-100 px-4 py-2 text-left hover:bg-gray-200"
//                     >
//                         Manage Bin
//                     </button>
//                     <button
//                         onClick={() => navigate('/collection-schedule')}
//                         className="block w-full rounded-md bg-gray-100 px-4 py-2 text-left hover:bg-gray-200"
//                     >
//                         View Schedule
//                     </button>
//                     <button
//                         onClick={() => navigate('/payments')}
//                         className="block w-full rounded-md bg-gray-100 px-4 py-2 text-left hover:bg-gray-200"
//                     >
//                         Payments
//                     </button>
//                     <button
//                         onClick={handleLogout}
//                         className="block w-full rounded-md bg-red-500 px-4 py-2 text-left text-white hover:bg-red-600"
//                     >
//                         Logout
//                     </button>
//                 </div>
//             </aside>

//             {/* Main Content */}
//             <div className="flex flex-1 flex-col bg-gray-100">
//                 {/* Header */}
//                 <header className="flex items-center justify-between bg-white p-4 shadow-md">
//                     <div className="flex items-center">
//                         <Avatar name={user.name || 'User'} size="40" round={true} className="mr-3" />
//                         <h1 className="text-xl font-bold">Hi {user.name || 'User'}</h1>
//                         <button onClick={() => setShowUpdateModal(true)} className="ml-4 p-2 text-gray-600 hover:text-gray-800">
//                             <HiOutlineCog size={24} />
//                         </button>
//                     </div>
//                     <div className="flex items-center">
//                         <span className="text-sm text-gray-500 mr-4">{currentDateTime}</span>
//                     </div>
//                 </header>

//                 {/* Main Section */}
//                 <main className="flex-grow overflow-y-auto p-6">
//                     <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//                         {/* Add cards for managing and viewing details */}
//                         <div className="bg-white p-6 rounded-lg shadow-md">
//                             <h3 className="text-lg font-semibold">Manage Bin</h3>
//                             <p className="text-gray-600">View and manage your bin status and requests.</p>
//                             <button
//                                 onClick={() => navigate('/FetchBin')}
//                                 className="mt-4 block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                             >
//                                 Manage Your Bin
//                             </button>
//                         </div>
//                         <div className="bg-white p-6 rounded-lg shadow-md">
//                             <h3 className="text-lg font-semibold">Collection Schedule</h3>
//                             <p className="text-gray-600">Check the collection schedule for your area.</p>
//                             <button
//                                 onClick={() => navigate('/collection-schedule')}
//                                 className="mt-4 block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                             >
//                                 View Schedule
//                             </button>
//                         </div>
//                         <div className="bg-white p-6 rounded-lg shadow-md">
//                             <h3 className="text-lg font-semibold">Payments</h3>
//                             <p className="text-gray-600">Manage your payments for waste collection services.</p>
//                             <button
//                                 onClick={() => navigate('/payments')}
//                                 className="mt-4 block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                             >
//                                 Go to Payments
//                             </button>
//                         </div>
//                     </div>
//                     {/* Display user tips */}
//                     <div className="mt-8">
//                         <h2 className="text-xl font-semibold">Tip of the Moment:</h2>
//                         <div className="mt-2 p-4 border rounded-md bg-gray-50">
//                             <h3 className="text-lg font-bold">{tips[currentTipIndex].title}</h3>
//                             <p className="text-gray-600">{tips[currentTipIndex].content}</p>
//                         </div>
//                     </div>
//                 </main>

//                 {/* Footer */}
//                 <footer className="bg-white p-4 text-center">
//                     <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} CountryClean.LK. All rights reserved.</p>
//                 </footer>
//             </div>

//             {/* Update User Modal */}
//             <UpdateUserModal
//                 isOpen={showUpdateModal}
//                 onClose={() => setShowUpdateModal(false)}
//                 user={user}
//                 onUpdate={handleUpdateUser}
//             />
//         </div>
//     );
// };

// export default UserDashboard;

///////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import axios from 'axios';
import { HiOutlineCog } from 'react-icons/hi'; // Import a settings icon

const UpdateUserModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [name, setName] = useState(user.name || '');
    const [address, setAddress] = useState(user.address || '');

    const handleUpdate = () => {
        onUpdate({ name, address });
        onClose(); // Close modal after update
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-bold">Update User Information</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-2 rounded bg-gray-300 px-4 py-2">
                        Cancel
                    </button>
                    <button onClick={handleUpdate} className="rounded bg-blue-500 px-4 py-2 text-white">
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
                headers: {
                    Authorization: `${token}`,
                },
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

    // Automatically change tips every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Update current date and time every second
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
                headers: {
                    Authorization: `Bearer ${token}`, // Make sure to include 'Bearer' if needed by your API
                },
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
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="flex w-64 flex-col space-y-4 rounded-md bg-white p-4 shadow-md">
                <h2 className="text-center text-2xl font-bold">CountryClean.LK</h2>
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => navigate('/FetchBin')}
                        className="block w-full rounded-md bg-gray-100 px-4 py-2 text-left hover:bg-gray-200"
                    >
                        Manage Bin
                    </button>
                    <button
                        onClick={() => navigate('/additional-pickups')}
                        className="block w-full rounded-md bg-gray-100 px-4 py-2 text-left hover:bg-gray-200"
                    >
                        View Schedule
                    </button>
                    <button
                        onClick={() => navigate('/payments')}
                        className="block w-full rounded-md bg-gray-100 px-4 py-2 text-left hover:bg-gray-200"
                    >
                        Payments
                    </button>
                    <button
                        onClick={handleLogout}
                        className="block w-full rounded-md bg-red-500 px-4 py-2 text-left text-white hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col bg-gray-100">
                {/* Header */}
                <header className="flex items-center justify-between bg-white p-4 shadow-md">
                    <div className="flex items-center">
                        <Avatar name={user.name || 'User'} size="40" round={true} className="mr-3" />
                        <h1 className="text-xl font-bold">Hi {user.name || 'User'}</h1>
                        <button onClick={() => setShowUpdateModal(true)} className="ml-4 p-2 text-gray-600 hover:text-gray-800">
                            <HiOutlineCog size={24} />
                        </button>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-4 text-sm text-gray-500">{currentDateTime}</span>
                    </div>
                </header>

                {/* Main Section */}
                <main className="flex-1 p-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    </div>

                    {/* Display user tips */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">Tip of the Moment:</h2>
                        <div className="mt-2 rounded-md border bg-gray-50 p-4">
                            <h3 className="text-lg font-bold">{tips[currentTipIndex].title}</h3>
                            <p className="text-gray-600">{tips[currentTipIndex].content}</p>
                        </div>
                    </div>

                    {/* User Statistics Section */}
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <h3 className="text-lg font-semibold">Total Collections</h3>
                            <p className="text-gray-600">{statistics.totalCollections}</p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <h3 className="text-lg font-semibold">Total Bins Managed</h3>
                            <p className="text-gray-600">{statistics.totalBins}</p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <h3 className="text-lg font-semibold">Garbage Collected (kg)</h3>
                            <p className="text-gray-600">{statistics.garbageCollected}</p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <h3 className="text-lg font-semibold">Collections This Month</h3>
                            <p className="text-gray-600">{statistics.collectionsThisMonth}</p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white p-4 text-center">
                    <p className="text-sm text-gray-600">
                        &copy; {new Date().getFullYear()} CountryClean.LK. All rights reserved.
                    </p>
                </footer>
            </div>

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
