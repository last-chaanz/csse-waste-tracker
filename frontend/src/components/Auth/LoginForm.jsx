// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const LoginForm = () => {
//     const navigate = useNavigate();
//     const [credentials, setCredentials] = useState({
//         email: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [loginError, setLoginError] = useState('');
//     const [showAlert, setShowAlert] = useState(false); // State for alert visibility
//     const [redirectUrl, setRedirectUrl] = useState('/'); // State for redirect URL

//     const handleChange = (e) => {
//         setCredentials({ ...credentials, [e.target.name]: e.target.value });
//         setErrors({ ...errors, [e.target.name]: '' });
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         if (!credentials.email) {
//             newErrors.email = 'Email is required';
//         } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
//             newErrors.email = 'Email is invalid';
//         }
//         if (!credentials.password) {
//             newErrors.password = 'Password is required';
//         } else if (credentials.password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters';
//         }
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;

//         setLoading(true);
//         setLoginError('');

//         try {
//             const response = await axios.post('http://localhost:4000/api/auth/login', credentials);
//             console.log('✌️response --->', response);

//             // Save token and user data for future requests
//             localStorage.setItem('token', response.data.token);
//             const userData = {
//                 role: response.data.role,
//                 userType: response.data.userType
//             };
//             localStorage.setItem('user', JSON.stringify(userData)); // Save user data

//             // Set redirect URL based on user role
//             if (response.data.role === 'admin') {
//                 setRedirectUrl('/admin/dashboard');
//             } else {
//                 setRedirectUrl('/user/dashboard');
//             }

//             setShowAlert(true); // Show the alert after successful login
//             setCredentials({ email: '', password: '' });
//         } catch (error) {
//             console.log('✌️error --->', error);
//             setLoginError('Invalid email or password');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAlertOk = () => {
//         setShowAlert(false); // Hide alert
//         navigate(redirectUrl); // Redirect to the appropriate dashboard
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <form
//                 onSubmit={handleSubmit}
//                 className="bg-white shadow-md rounded-lg p-8 max-w-md w-full border border-gray-200"
//             >
//                 <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
//                 {loginError && (
//                     <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//                         {loginError}
//                     </div>
//                 )}
//                 <div className="mb-4">
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                         Email
//                     </label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={credentials.email}
//                         onChange={handleChange}
//                         className={`border p-2 w-full rounded focus:outline-none focus:ring ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
//                         placeholder="Enter your email"
//                     />
//                     {errors.email && (
//                         <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                     )}
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                         Password
//                     </label>
//                     <input
//                         type="password"
//                         name="password"
//                         value={credentials.password}
//                         onChange={handleChange}
//                         className={`border p-2 w-full rounded focus:outline-none focus:ring ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
//                         placeholder="Enter your password"
//                     />
//                     {errors.password && (
//                         <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//                     )}
//                 </div>
//                 <button
//                     type="submit"
//                     className={`w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     disabled={loading}
//                 >
//                     {loading ? 'Logging in...' : 'Login'}
//                 </button>
//                 <p className="mt-4 text-sm text-center">
//                     Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
//                 </p>
//             </form>

//             {/* Alert Popup */}
//             {showAlert && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white p-6 rounded shadow-lg">
//                         <h3 className="text-lg font-semibold mb-4">Login Successful!</h3>
//                         <p>You have logged in successfully.</p>
//                         <div className="flex justify-end mt-4">
//                             <button
//                                 onClick={handleAlertOk}
//                                 className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
//                             >
//                                 OK
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LoginForm;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const [showAlert, setShowAlert] = useState(false); // State for alert visibility
    const [redirectUrl, setRedirectUrl] = useState('/'); // State for redirect URL

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let errorMessage = '';
        if (name === 'email') {
            errorMessage = validateEmail(value);
        } else if (name === 'password') {
            errorMessage = validatePassword(value);
        }
        setErrors({ ...errors, [name]: errorMessage });
    };

    const validateForm = () => {
        const emailError = validateEmail(credentials.email);
        const passwordError = validatePassword(credentials.password);
        const newErrors = { email: emailError, password: passwordError };
        setErrors(newErrors);
        return Object.keys(newErrors).every((key) => !newErrors[key]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setLoginError('');

        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', credentials);

            // Save token and user data for future requests
            const { token, role, userType } = response.data;

            // Store the JWT token in local storage
            localStorage.setItem('token', token);
            const userData = {
                role,
                userType
            };
            localStorage.setItem('user', JSON.stringify(userData)); // Save user data

            // Set redirect URL based on user role
            if (role === 'admin') {
                setRedirectUrl('/admin/dashboard');
            } else if (role === 'collector') {
                setRedirectUrl('/collector/dashboard');
            } else {
                setRedirectUrl('/user/dashboard');
            }

            setShowAlert(true);
            setCredentials({ email: '', password: '' });
        } catch (error) {
            console.log('✌️error --->', error);
            setLoginError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleAlertOk = () => {
        setShowAlert(false); // Hide alert
        navigate(redirectUrl); // Redirect to the appropriate dashboard
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-8 max-w-md w-full border border-gray-200"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
                {loginError && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {loginError}
                    </div>
                )}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`border p-2 w-full rounded focus:outline-none focus:ring ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`border p-2 w-full rounded focus:outline-none focus:ring ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className={`w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8H4z" />
                            </svg>
                            Logging in...
                        </span>
                    ) : 'Login'}
                </button>
                <p className="mt-4 text-sm text-center">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                </p>
            </form>

            {/* Alert Popup */}
            {showAlert && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Login Successful!</h3>
                        <p>You have logged in successfully.</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleAlertOk}
                                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginForm;

// import React, { useState } from 'react';
// import { Trash2, Mail, Lock, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

// const LoginForm = () => {
//     const [credentials, setCredentials] = useState({ email: '', password: '' });
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [loginError, setLoginError] = useState('');
//     const [showAlert, setShowAlert] = useState(false);
//     const [currentPage, setCurrentPage] = useState('login'); // 'login', 'register', or 'dashboard'

//     const handleChange = (e) => {
//         setCredentials({ ...credentials, [e.target.name]: e.target.value });
//         setErrors({ ...errors, [e.target.name]: '' });
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         if (!credentials.email) newErrors.email = 'Email is required';
//         else if (!/\S+@\S+\.\S+/.test(credentials.email)) newErrors.email = 'Email is invalid';
//         if (!credentials.password) newErrors.password = 'Password is required';
//         else if (credentials.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;

//         setLoading(true);
//         setLoginError('');

//         try {
//             // Simulating an API call
//             await new Promise(resolve => setTimeout(resolve, 1000));
            
//             setShowAlert(true);
//             setCredentials({ email: '', password: '' });
//         } catch (error) {
//             console.error('Login error:', error);
//             setLoginError('Invalid email or password');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAlertOk = () => {
//         setShowAlert(false);
//         setCurrentPage('dashboard');
//     };

//     const renderLoginForm = () => (
//         <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                 </label>
//                 <div className="relative">
//                     <input
//                         type="email"
//                         name="email"
//                         value={credentials.email}
//                         onChange={handleChange}
//                         className={`pl-10 pr-3 py-2 w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
//                         placeholder="Enter your email"
//                     />
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 </div>
//                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//             </div>
//             <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                     Password
//                 </label>
//                 <div className="relative">
//                     <input
//                         type="password"
//                         name="password"
//                         value={credentials.password}
//                         onChange={handleChange}
//                         className={`pl-10 pr-3 py-2 w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
//                         placeholder="Enter your password"
//                     />
//                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 </div>
//                 {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//             </div>
//             <button
//                 type="submit"
//                 className={`w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 disabled={loading}
//             >
//                 {loading ? (
//                     <span className="flex items-center justify-center">
//                         <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                         </svg>
//                         Logging in...
//                     </span>
//                 ) : 'Login'}
//             </button>
//         </form>
//     );

//     const renderRegisterForm = () => (
//         <div className="text-center">
//             <h2 className="text-2xl font-bold mb-4">Register</h2>
//             <p className="mb-4">This is a placeholder for the registration form.</p>
//             <button
//                 onClick={() => setCurrentPage('login')}
//                 className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300"
//             >
//                 Back to Login
//             </button>
//         </div>
//     );

//     const renderDashboard = () => (
//         <div className="text-center">
//             <h2 className="text-2xl font-bold mb-4">Welcome to GMS Dashboard</h2>
//             <p className="mb-4">This is a placeholder for the dashboard content.</p>
//             <button
//                 onClick={() => setCurrentPage('login')}
//                 className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300"
//             >
//                 Logout
//             </button>
//         </div>
//     );

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
//             <div className="bg-white shadow-2xl rounded-lg p-8 max-w-md w-full border border-gray-200">
//                 {currentPage !== 'dashboard' && (
//                     <div className="flex justify-center mb-6">
//                         <Trash2 className="text-green-600 w-16 h-16" />
//                     </div>
//                 )}
                
//                 {currentPage === 'login' && (
//                     <>
//                         <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login to GMS</h2>
//                         {loginError && (
//                             <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex items-center">
//                                 <AlertTriangle className="w-5 h-5 mr-2" />
//                                 {loginError}
//                             </div>
//                         )}
//                         {renderLoginForm()}
//                         <p className="mt-6 text-sm text-center text-gray-600">
//                             Don't have an account? <button onClick={() => setCurrentPage('register')} className="text-green-600 hover:underline font-medium">Register</button>
//                         </p>
//                     </>
//                 )}

//                 {currentPage === 'register' && renderRegisterForm()}
//                 {currentPage === 'dashboard' && renderDashboard()}
//             </div>

//             {showAlert && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
//                         <div className="flex items-center justify-center mb-4 text-green-600">
//                             <CheckCircle className="w-12 h-12" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-center mb-2">Login Successful!</h3>
//                         <p className="text-gray-600 text-center mb-4">You have successfully logged in to the Garbage Management System.</p>
//                         <button
//                             onClick={handleAlertOk}
//                             className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300"
//                         >
//                             Go to Dashboard
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LoginForm;
