// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import LoginImage from './images/RegisterImageFinal.jpg';

// // InputField Component
// const InputField = ({ label, type, name, value, onChange, placeholder, error }) => (
//     <div className="mb-4">
//         <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
//             {label}
//         </label>
//         <input
//             type={type}
//             name={name}
//             value={value}
//             onChange={onChange}
//             aria-invalid={!!error}
//             aria-describedby={error ? `${name}-error` : null}
//             className={`border p-2 w-full rounded focus:outline-none focus:ring ${
//                 error ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholder={placeholder}
//         />
//         {error && (
//             <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
//                 {error}
//             </p>
//         )}
//     </div>
// );

// // Success Message Component
// const SuccessMessage = ({ message }) => (
//     <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
//         {message}
//     </div>
// );

// // Error Message Component
// const ErrorMessage = ({ message }) => (
//     <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//         {message}
//     </div>
// );

// // RegistrationForm Component
// const RegistrationForm = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         address: '',
//         userType: 'residence', // Default userType
//         role: 'user' // Assuming 'user' role by default
//     });
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const navigate = useNavigate(); // Create navigate function

//     // Reset form data when component mounts
//     useEffect(() => {
//         setFormData({
//             name: '',
//             email: '',
//             password: '',
//             address: '',
//             userType: 'residence',
//             role: 'user'
//         });
//     }, []); // Empty dependency array means this runs once on mount

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // Client-side validation
//     const validateForm = () => {
//         const newErrors = {};
//         const { name, email, password, address } = formData;

//         if (!name) newErrors.name = 'Name is required';
//         if (!email) {
//             newErrors.email = 'Email is required';
//         } else if (!/\S+@\S+\.\S+/.test(email)) {
//             newErrors.email = 'Email is invalid';
//         }
//         if (!password) {
//             newErrors.password = 'Password is required';
//         } else if (password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters';
//         } else if (!/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(password)) {
//             newErrors.password = 'Password must contain both letters and numbers';
//         }
//         if (!address) newErrors.address = 'Address is required';

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // Submit handler
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;

//         setLoading(true);
//         setErrors({});
//         setSuccessMessage('');

//         try {
//             const response = await axios.post('http://localhost:4000/api/auth/register', formData);
//             setSuccessMessage('Registration successful! Please verify your email.');
//             // Reset form data after successful registration
//             setFormData({
//                 name: '',
//                 email: '',
//                 password: '',
//                 address: '',
//                 userType: 'residence',
//                 role: 'user'
//             });
//             navigate('/'); // Navigate to the home or login page
//         } catch (error) {
//             setErrors({
//                 submit: error.response?.data?.msg || 'Registration failed',
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <form
//                 onSubmit={handleSubmit}
//                 className="bg-white shadow-md rounded-lg p-8 max-w-md w-full border border-gray-200"
//             >
//                 <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

//                 {successMessage && <SuccessMessage message={successMessage} />}
//                 {errors.submit && <ErrorMessage message={errors.submit} />}

//                 {/* Name Input */}
//                 <InputField
//                     label="Name"
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Enter your name"
//                     error={errors.name}
//                 />

//                 {/* Email Input */}
//                 <InputField
//                     label="Email"
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Enter your email"
//                     error={errors.email}
//                 />

//                 {/* Password Input */}
//                 <InputField
//                     label="Password"
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Enter your password"
//                     error={errors.password}
//                 />

//                 {/* Address Input */}
//                 <InputField
//                     label="Address"
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     placeholder="Enter your address"
//                     error={errors.address}
//                 />

//                 {/* User Type Selection */}
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         User Type
//                     </label>
//                     <select
//                         name="userType"
//                         value={formData.userType}
//                         onChange={handleChange}
//                         className="border p-2 w-full rounded focus:outline-none focus:ring border-gray-300"
//                     >
//                         <option value="residence">Residence</option>
//                         <option value="business">Business</option>
//                     </select>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                     type="submit"
//                     className={`w-full bg-blue-500 text-white p-2 rounded focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     disabled={loading}
//                 >
//                     {loading ? 'Registering...' : 'Register'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default RegistrationForm;

//////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RegisterImageFinal from "./images/RegisterImageFinal.jpg"; // Ensure the path is correct
import LoginImage from "./images/logoImage.jpg"; // Adjust the path if needed

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
            className={`border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
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
    const [showPassword, setShowPassword] = useState(false); // For password visibility toggle
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
        e.preventDefault(); // Prevent the default form submission
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
            if (error.response) {
                setErrors({
                    submit: error.response.data.msg || 'Registration failed',
                });
            } else {
                setErrors({
                    submit: 'Network error, please try again later',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side: Image and Content */}
            <div
        className="relative flex-1"
        style={{
            backgroundImage: `url(${RegisterImageFinal})`,
            backgroundSize: 'contain', // Change to 'contain' to keep the entire image visible
            backgroundPosition: 'top center', // Aligns the image to the top center
            height: '100vh',
            width: '100%',
            paddingTop: '40%', // Adds padding to push the content down
            backgroundRepeat: 'no-repeat', // Prevents the background from repeating
            }}
>
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="max-w-full mx-auto bg-white rounded-lg shadow-md mb-6 p-4 w-full">
                        <h2 className="text-3xl font-semibold text-center text-blue-700">Become a champion for a cleaner, greener community!</h2>
                        <p className="mt-4 text-center">Together, we will revolutionize waste management and create a vibrant environment for everyone to enjoy!</p>
                    </div>
                </div>
            </div>
            

            {/* Right Side: Registration Form */}
            <div className="flex items-center justify-center flex-1 bg-white p-8 border-l"> {/* Changed items-start to items-center */}
                <div className="max-w-sm w-full"> {/* Reduced max width for form */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-center mb-2"> {/* Adjusted margin */}
                            <img src={LoginImage} alt="Logo" className="h-32" /> {/* Reduced logo size */}
                        </div>
                        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-700">Register with Garbage Collectors</h2>

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
                            type={showPassword ? 'text' : 'password'} // Toggle between text and password
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            error={errors.password}
                        />
                        <button type="button" onClick={togglePasswordVisibility} className="text-blue-500 mb-2">
                            {showPassword ? 'Hide Password' : 'Show Password'}
                        </button>

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
                            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                                User Type
                            </label>
                            <select
                                name="userType"
                                value={formData.userType}
                                onChange={handleChange}
                                className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            >
                                <option value="residence">Residence</option>
                                <option value="business">Business</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>

                        <p className="mt-4 text-center">
                            Already have an account?{' '}
                            <a href="/" className="text-blue-500 hover:underline">Login here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import RegisterImageFinal from "./images/RegisterImageFinal.jpg"; // Ensure the path is correct
// import LoginImage from "./images/logoImage.jpg"; // Adjust the path if needed

// // InputField Component
// const InputField = ({ label, type, name, value, onChange, placeholder, error }) => (
//     <div className="mb-4">
//         <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
//             {label}
//         </label>
//         <input
//             type={type}
//             name={name}
//             value={value}
//             onChange={onChange}
//             aria-invalid={!!error}
//             aria-describedby={error ? `${name}-error` : null}
//             className={`border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
//                 error ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholder={placeholder}
//         />
//         {error && (
//             <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
//                 {error}
//             </p>
//         )}
//     </div>
// );

// // Success Message Component
// const SuccessMessage = ({ message }) => (
//     <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
//         {message}
//     </div>
// );

// // Error Message Component
// const ErrorMessage = ({ message }) => (
//     <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//         {message}
//     </div>
// );

// // RegistrationForm Component
// const RegistrationForm = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         address: '',
//         userType: 'residence', // Default userType
//         role: 'user' // Assuming 'user' role by default
//     });
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [showPassword, setShowPassword] = useState(false); // For password visibility toggle
//     const navigate = useNavigate(); // Create navigate function

//     // Reset form data when component mounts
//     useEffect(() => {
//         setFormData({
//             name: '',
//             email: '',
//             password: '',
//             address: '',
//             userType: 'residence',
//             role: 'user'
//         });
//     }, []); // Empty dependency array means this runs once on mount

//     // Handle form input changes
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // Client-side validation
//     const validateForm = () => {
//         const newErrors = {};
//         const { name, email, password, address } = formData;

//         if (!name) newErrors.name = 'Name is required';
//         if (!email) {
//             newErrors.email = 'Email is required';
//         } else if (!/\S+@\S+\.\S+/.test(email)) {
//             newErrors.email = 'Email is invalid';
//         }
//         if (!password) {
//             newErrors.password = 'Password is required';
//         } else if (password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters';
//         } else if (!/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(password)) {
//             newErrors.password = 'Password must contain both letters and numbers';
//         }
//         if (!address) newErrors.address = 'Address is required';

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // Submit handler
//     const handleSubmit = async (e) => {
//         e.preventDefault(); // Prevent the default form submission
//         if (!validateForm()) return;

//         setLoading(true);
//         setErrors({});
//         setSuccessMessage('');

//         try {
//             const response = await axios.post('http://localhost:4000/api/auth/register', formData);
//             setSuccessMessage('Registration successful! Please verify your email.');

//             // Reset form data after successful registration
//             setFormData({
//                 name: '',
//                 email: '',
//                 password: '',
//                 address: '',
//                 userType: 'residence',
//                 role: 'user'
//             });

//             navigate('/'); // Navigate to the home or login page
//         } catch (error) {
//             if (error.response) {
//                 setErrors({
//                     submit: error.response.data.msg || 'Registration failed',
//                 });
//             } else {
//                 setErrors({
//                     submit: 'Network error, please try again later',
//                 });
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Toggle password visibility
//     const togglePasswordVisibility = () => {
//         setShowPassword((prev) => !prev);
//     };

//     return (
//         <div className="flex min-h-screen">
//             {/* Left Side: Image and Content */}
//             <div
//                 className="relative flex-1"
//                 style={{
//                     backgroundImage: `url(${RegisterImageFinal})`,
//                     backgroundSize: 'contain', // Keep the entire image visible
//                     backgroundPosition: 'top center', // Aligns the image to the top center
//                     height: '100vh',
//                     width: '100%',
//                     paddingTop: '40%', // Adds padding to push the content down
//                     backgroundRepeat: 'no-repeat', // Prevents the background from repeating
//                 }}
//             >
//                 <div className="absolute inset-0 flex flex-col justify-end p-4">
//                     <div className="max-w-full mx-auto bg-white rounded-lg shadow-md mb-6 p-4 w-full">
//                         <h2 className="text-3xl font-semibold text-center text-blue-700">
//                             Become a champion for a cleaner, greener community!
//                         </h2>
//                         <p className="mt-4 text-center">
//                             Together, we will revolutionize waste management and create a vibrant environment for everyone to enjoy!
//                         </p>
//                     </div>

//                     {/* New Content Box */}
//                     <div className="max-w-full mx-auto bg-white rounded-lg shadow-md mb-6 p-4 w-full">
//                         <h2 className="text-3xl font-semibold text-center text-blue-700">
//                             Join Us to Keep the Country Clean!
//                         </h2>
//                         <p className="mt-4 text-center">
//                             Register now to help with waste management and community cleanliness.
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* Right Side: Registration Form */}
//             <div className="flex items-center justify-center flex-1 bg-white p-8 border-l">
//                 <div className="max-w-sm w-full">
//                     <div className="bg-white p-6 rounded-lg shadow-md">
//                         <div className="flex justify-center mb-2">
//                             <img src={LoginImage} alt="Logo" className="h-32" />
//                         </div>
//                         <h2 className="text-2xl font-semibold text-center mb-4 text-blue-700">
//                             Register with Garbage Collectors
//                         </h2>

//                         {successMessage && <SuccessMessage message={successMessage} />}
//                         {errors.submit && <ErrorMessage message={errors.submit} />}

//                         {/* Name Input */}
//                         <InputField
//                             label="Name"
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             placeholder="Enter your name"
//                             error={errors.name}
//                         />

//                         {/* Email Input */}
//                         <InputField
//                             label="Email"
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             placeholder="Enter your email"
//                             error={errors.email}
//                         />

//                         {/* Password Input */}
//                         <InputField
//                             label="Password"
//                             type={showPassword ? 'text' : 'password'} // Toggle between text and password
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             placeholder="Enter your password"
//                             error={errors.password}
//                         />
//                         <button type="button" onClick={togglePasswordVisibility} className="text-blue-500 mb-2">
//                             {showPassword ? 'Hide Password' : 'Show Password'}
//                         </button>

//                         {/* Address Input */}
//                         <InputField
//                             label="Address"
//                             type="text"
//                             name="address"
//                             value={formData.address}
//                             onChange={handleChange}
//                             placeholder="Enter your address"
//                             error={errors.address}
//                         />

//                         {/* User Type Selection */}
//                         <div className="mb-4">
//                             <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
//                                 User Type
//                             </label>
//                             <select
//                                 name="userType"
//                                 value={formData.userType}
//                                 onChange={handleChange}
//                                 className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                             >
//                                 <option value="residence">Residence</option>
//                                 <option value="business">Business</option>
//                             </select>
//                         </div>

//                         {/* Submit Button */}
//                         <button
//                             onClick={handleSubmit}
//                             disabled={loading}
//                             className={`w-full p-3 text-white rounded-lg focus:outline-none transition duration-200 ${loading ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'}`}
//                         >
//                             {loading ? 'Registering...' : 'Register'}
//                         </button>

//                         <div className="mt-4 text-center">
//                             <p className="text-sm">
//                                 Already have an account?{' '}
//                                 <a href="/login" className="text-blue-700 hover:underline">
//                                     Log in
//                                 </a>
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RegistrationForm;
