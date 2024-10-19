import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const navItems = [
        { name: 'Home', path: '/user/dashboard' },
        { name: 'Manage Bin', path: '/FetchBin' },
        { name: 'View Schedule', path: '/additional-pickups' },
        { name: 'Payments', path: '/payments' },
    ];

    const handleClick = (item) => {
        setActiveItem(item.name); // Set active item immediately
        navigate(item.path); // Navigate after setting active item
    };

    return (
        <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <div className="flex items-center">
                        <span className="ml-3 text-2xl font-semibold tracking-wide text-gray-300">
                            Green<span className="font-bold text-green-500"> Stream</span>
                        </span>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-6">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleClick(item)}
                                    className={`group relative px-3 py-2 text-sm font-medium text-gray-300 transition-colors duration-300 hover:text-white ${
                                        activeItem === item.name ? 'text-white' : ''
                                    }`}
                                >
                                    {item.name}
                                    <span
                                        className={`absolute bottom-0 left-0 h-0.5 bg-green-400 transition-all duration-300 ${
                                            activeItem === item.name
                                                ? 'w-full' // Underline appears immediately if active
                                                : 'w-0 group-hover:w-full'
                                        }`}
                                    ></span>
                                </button>
                            ))}

                            <button
                                onClick={handleLogout}
                                className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-red-600 hover:shadow-md"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleClick(item)}
                                className="block w-full rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                {item.name}
                            </button>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="mt-4 block w-full rounded-md bg-red-500 px-3 py-2 text-base font-medium text-white hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
