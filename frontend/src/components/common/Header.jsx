import React from 'react';
import { Avatar } from 'react-avatar';
import { HiOutlineCog, HiOutlineCalendar } from 'lucide-react';

const Header = ({ user, currentDateTime, setShowUpdateModal }) => {
    return (
        <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 shadow-lg">
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar name={user.name || 'User'} size="60" round={true} className="border-4 border-white shadow-md" />
                        <div>
                            <h1 className="text-2xl font-light text-white">
                                Welcome back, <span className="font-semibold">{user.name || 'User'}</span>
                            </h1>
                            <p className="mt-1 text-sm font-medium text-indigo-100">How are you doing today?</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-indigo-100">
                                <HiOutlineCalendar className="mr-1 inline-block h-4 w-4" />
                                {currentDateTime}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowUpdateModal(true)}
                            className="rounded-full bg-white bg-opacity-20 p-2 text-white transition-all duration-300 hover:bg-opacity-30 hover:shadow-md"
                            aria-label="Settings"
                        >
                            <HiOutlineCog className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
