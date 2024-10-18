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

//     const validateEmail = (email) => {
//         if (!email) return 'Email is required';
//         if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
//         return '';
//     };

//     const validatePassword = (password) => {
//         if (!password) return 'Password is required';
//         if (password.length < 6) return 'Password must be at least 6 characters';
//         return '';
//     };

//     const handleBlur = (e) => {
//         const { name, value } = e.target;
//         let errorMessage = '';
//         if (name === 'email') {
//             errorMessage = validateEmail(value);
//         } else if (name === 'password') {
//             errorMessage = validatePassword(value);
//         }
//         setErrors({ ...errors, [name]: errorMessage });
//     };

//     const validateForm = () => {
//         const emailError = validateEmail(credentials.email);
//         const passwordError = validatePassword(credentials.password);
//         const newErrors = { email: emailError, password: passwordError };
//         setErrors(newErrors);
//         return Object.keys(newErrors).every((key) => !newErrors[key]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;

//         setLoading(true);
//         setLoginError('');

//         try {
//             const response = await axios.post('http://localhost:4000/api/auth/login', credentials);

//             // Save token and user data for future requests
//             const { token, role, userType } = response.data;

//             // Store the JWT token in local storage
//             localStorage.setItem('token', token);
//             const userData = {
//                 role,
//                 userType
//             };
//             localStorage.setItem('user', JSON.stringify(userData)); // Save user data

//             // Set redirect URL based on user role
//             if (role === 'admin') {
//                 setRedirectUrl('/admin/dashboard');
//             } else if (role === 'collector') {
//                 setRedirectUrl('/collector/dashboard');
//             } else {
//                 setRedirectUrl('/user/dashboard');
//             }

//             setShowAlert(true);
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
//                         onBlur={handleBlur}
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
//                         onBlur={handleBlur}
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
//                     {loading ? (
//                         <span className="flex items-center justify-center">
//                             <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
//                                 <path className="opacity-75" fill="currentColor" d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8H4z" />
//                             </svg>
//                             Logging in...
//                         </span>
//                     ) : 'Login'}
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
import LoginImage from './images/logoImage.jpg';

const LoginForm = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('/');

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

            const { token, role, userType } = response.data;

            localStorage.setItem('token', token);
            const userData = {
                role,
                userType
            };
            localStorage.setItem('user', JSON.stringify(userData));

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
        setShowAlert(false);
        navigate(redirectUrl);
    };

    return (
        <>
            {showAlert && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded shadow-md">
                        <h2 className="text-lg font-bold">Success!</h2>
                        <p>You have logged in successfully.</p>
                        <button
                            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                            onClick={handleAlertOk}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
                <div className="flex items-center max-w-4xl w-full shadow-lg bg-white rounded-xl">
                    <div className="w-1/2 hidden md:flex flex-col justify-center p-12 bg-gradient-to-b from-blue-300 to-blue-700 text-white rounded-l-xl transform scale-110 shadow-2xl">
                        <h2 className="text-4xl font-bold mb-4">Let's Keep Our Country Clean!
                        </h2>
                        <p className="text-lg mb-6">
                        "Your small actions today can lead to a cleaner tomorrow. Together, let's keep our nation beautiful!"
                        </p>
                        <p className="text-lg">Join us and start exploring!</p>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="w-full md:w-1/2 p-8"
                    >
                        <div className="flex justify-center mb-6">
                            <img src={LoginImage} alt="Logo" className="h-32" />
                        </div>
                        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Welcome Back!</h2>
                        <p className="text-center text-black mb-6">
                        Please enter your credentials to access your account.</p>
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
                                className={`border p-3 w-full rounded-xl focus:outline-none focus:ring ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                                className={`border p-3 w-full rounded-xl focus:outline-none focus:ring ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter your password"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <button
                            type="submit"
                            className={`w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <p className="mt-8 text-sm text-gray-600 text-center">
                            Don’t have an account?{' '}
                            <Link to="/register" className="text-blue-700 hover:underline font-semibold">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginForm;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import LoginImage from './images/logoImage.jpg';

// const LoginForm = () => {
//     const navigate = useNavigate();
//     const [credentials, setCredentials] = useState({
//         email: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [loginError, setLoginError] = useState('');
//     const [showAlert, setShowAlert] = useState(false);
//     const [redirectUrl, setRedirectUrl] = useState('/');

//     const handleChange = (e) => {
//         setCredentials({ ...credentials, [e.target.name]: e.target.value });
//         setErrors({ ...errors, [e.target.name]: '' });
//     };

//     const validateEmail = (email) => {
//         if (!email) return 'Email is required';
//         if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
//         return '';
//     };

//     const validatePassword = (password) => {
//         if (!password) return 'Password is required';
//         if (password.length < 6) return 'Password must be at least 6 characters';
//         return '';
//     };

//     const handleBlur = (e) => {
//         const { name, value } = e.target;
//         let errorMessage = '';
//         if (name === 'email') {
//             errorMessage = validateEmail(value);
//         } else if (name === 'password') {
//             errorMessage = validatePassword(value);
//         }
//         setErrors({ ...errors, [name]: errorMessage });
//     };

//     const validateForm = () => {
//         const emailError = validateEmail(credentials.email);
//         const passwordError = validatePassword(credentials.password);
//         const newErrors = { email: emailError, password: passwordError };
//         setErrors(newErrors);
//         return Object.keys(newErrors).every((key) => !newErrors[key]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;

//         setLoading(true);
//         setLoginError('');

//         try {
//             const response = await axios.post('http://localhost:4000/api/auth/login', credentials);
//             const { token, role, userType } = response.data;

//             localStorage.setItem('token', token);
//             const userData = { role, userType };
//             localStorage.setItem('user', JSON.stringify(userData));

//             if (role === 'admin') {
//                 setRedirectUrl('/admin/dashboard');
//             } else if (role === 'collector') {
//                 setRedirectUrl('/collector/dashboard');
//             } else {
//                 setRedirectUrl('/user/dashboard');
//             }

//             // Show success alert
//             setShowAlert(true);
//             setCredentials({ email: '', password: '' });

//             // Log the redirect URL
//             console.log(`Redirecting to: ${redirectUrl}`);

//             // Navigate after 2000 ms
//             setTimeout(() => {
//                 setShowAlert(false);
//                 navigate(redirectUrl);
//             }, 2000);
//         } catch (error) {
//             console.log('✌️error --->', error);
//             setLoginError('Invalid email or password');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             {showAlert && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50">
//                     <div className="bg-white p-5 rounded shadow-md">
//                         <h2 className="text-lg font-bold">Success!</h2>
//                         <p>You have logged in successfully.</p>
//                     </div>
//                 </div>
//             )}
//             <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
//                 <div className="flex items-center max-w-4xl w-full shadow-lg bg-white rounded-xl">
//                     <div className="w-1/2 hidden md:flex flex-col justify-center p-12 bg-gradient-to-b from-blue-300 to-blue-700 text-white rounded-l-xl transform scale-110 shadow-2xl">
//                         <h2 className="text-4xl font-bold mb-4">Let's Keep Our Country Clean!</h2>
//                         <p className="text-lg mb-6">
//                             "Your small actions today can lead to a cleaner tomorrow. Together, let's keep our nation beautiful!"
//                         </p>
//                         <p className="text-lg">Join us and start exploring!</p>
//                     </div>
//                     <form onSubmit={handleSubmit} className="w-full md:w-1/2 p-8">
//                         <div className="flex justify-center mb-6">
//                             <img src={LoginImage} alt="Logo" className="h-32" />
//                         </div>
//                         <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Welcome Back!</h2>
//                         <p className="text-center text-black mb-6">
//                             Please enter your credentials to access your account.
//                         </p>
//                         {loginError && (
//                             <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//                                 {loginError}
//                             </div>
//                         )}
//                         <div className="mb-4">
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={credentials.email}
//                                 onChange={handleChange}
//                                 onBlur={handleBlur}
//                                 className={`border p-3 w-full rounded-xl focus:outline-none focus:ring ${
//                                     errors.email ? 'border-red-500' : 'border-gray-300'
//                                 }`}
//                                 placeholder="Enter your email"
//                             />
//                             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//                         </div>
//                         <div className="mb-4">
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Password
//                             </label>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 value={credentials.password}
//                                 onChange={handleChange}
//                                 onBlur={handleBlur}
//                                 className={`border p-3 w-full rounded-xl focus:outline-none focus:ring ${
//                                     errors.password ? 'border-red-500' : 'border-gray-300'
//                                 }`}
//                                 placeholder="Enter your password"
//                             />
//                             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//                         </div>
//                         <button
//                             type="submit"
//                             className={`w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 ${
//                                 loading ? 'opacity-50 cursor-not-allowed' : ''
//                             }`}
//                             disabled={loading}
//                         >
//                             {loading ? 'Logging in...' : 'Login'}
//                         </button>
//                         <p className="mt-8 text-sm text-gray-600 text-center">
//                             Don’t have an account?{' '}
//                             <Link to="/register" className="text-blue-700 hover:underline font-semibold">
//                                 Sign Up
//                             </Link>
//                         </p>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default LoginForm;

