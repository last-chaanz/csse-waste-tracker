// // src/components/Dashboard.js

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Dashboard = () => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 // Redirect to login if no token is found
//                 window.location.href = '/';
//                 return;
//             }
            
//             try {
//                 const response = await axios.get('http://localhost:4000/api/auth/dashboard', {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setUser(response.data);
//             } catch (err) {
//                 setError('Error fetching user data');
//                 console.error(err); // Log the error for debugging
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUserData();
//     }, []);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;
//     if (!user) return null; // Already redirected if no user data

//     return (
//         <div>
//             <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
//             <p>Email: {user.email}</p>
//             {user.role && <p>Role: {user.role}</p>}
//             {user.profilePicture && (
//                 <img src={user.profilePicture} alt="Profile" className="w-32 h-32 rounded-full" />
//             )}

//             {/* Conditional rendering based on user type or role */}
//             {user.userType === 'business' && <div>Business Dashboard Section</div>}
//             {user.userType === 'admin' && <div>Admin Dashboard Section</div>}
//             {user.userType === 'resident' && <div>Resident Dashboard Section</div>}

//             <button 
//                 onClick={() => {
//                     localStorage.removeItem('token');
//                     window.location.href = '/'; // Redirect to login after logout
//                 }} 
//                 className="mt-4 bg-red-600 text-white p-2 rounded"
//             >
//                 Logout
//             </button>
//         </div>
//     );
// };

// export default Dashboard;
