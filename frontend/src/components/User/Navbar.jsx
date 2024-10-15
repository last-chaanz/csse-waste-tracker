import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in based on token

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token on logout
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo or Brand Name */}
                <Link to="/" className="text-white text-xl font-bold">
                    MyApp
                </Link>

                {/* Links */}
                <div className="space-x-4">
                    <NavLink
                        to="/"
                        exact
                        className={({ isActive }) =>
                            isActive ? 'text-yellow-500' : 'text-white'
                        }
                        activeClassName="text-yellow-500"
                    >
                        Home
                    </NavLink>

                    {isLoggedIn ? (
                        <>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    isActive ? 'text-yellow-500' : 'text-white'
                                }
                                activeClassName="text-yellow-500"
                            >
                                Dashboard
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="text-white ml-4 hover:text-yellow-500"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive ? 'text-yellow-500' : 'text-white'
                                }
                                activeClassName="text-yellow-500"
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    isActive ? 'text-yellow-500' : 'text-white'
                                }
                                activeClassName="text-yellow-500"
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
