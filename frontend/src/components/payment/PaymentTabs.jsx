// PaymentTabs.jsx
import React, { useState } from 'react';
import PendingPayments from './PendingPayments';
import PaymentHistory from './PaymentHistory';
import Avatar from 'react-avatar';
import Navbar from '../User/Navbar';

const PaymentTabs = () => {
    const [activeTab, setActiveTab] = useState('due');

    const user = { name: 'Prathila' };

    return (
        <>
            {/* header section */}
            <header className="flex items-center justify-between bg-white p-4 shadow-md">
                <div className="flex items-center">
                    <Avatar name={user.name || 'User'} size="40" round={true} className="mr-3" />
                    <h1 className="text-xl font-bold">Hi {user.name || 'User'}</h1>
                    {/* Dropdown for Profile Settings */}
                    <div className="relative ml-3 inline-block text-left">
                        <div>
                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                                onClick={() => {}}
                            >
                                ⚙️
                                <svg
                                    className="-mr-1 ml-2 h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => {}}
                    className="rounded bg-red-500 px-4 py-2 text-white transition duration-300 hover:bg-red-600"
                >
                    Logout
                </button>
            </header>
            {/* main section */}
            <div className="container mx-auto max-w-4xl p-4">
                <div className="mb-8">
                    <h1 className="mb-2 text-2xl font-bold text-gray-800">Payment Management</h1>
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('due')}
                                className={`border-b-2 px-1 py-4 text-sm font-medium ${
                                    activeTab === 'due'
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Due Payments
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`border-b-2 px-1 py-4 text-sm font-medium ${
                                    activeTab === 'history'
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Payment History
                            </button>
                        </nav>
                    </div>
                </div>

                {activeTab === 'due' ? <PendingPayments /> : <PaymentHistory />}
            </div>

            {/* Footer Section */}
            <div>
                <footer className="bg-white p-4 text-center shadow-md">
                    <p className="text-gray-600">&copy; {new Date().getFullYear()} CountryClean. All rights reserved.</p>
                    <p className="text-gray-600">
                        Contact us:{' '}
                        <a href="mailto:support@example.com" className="text-blue-500">
                            support@countryclean.com
                        </a>
                    </p>
                </footer>
            </div>
        </>
    );
};
export default PaymentTabs;
