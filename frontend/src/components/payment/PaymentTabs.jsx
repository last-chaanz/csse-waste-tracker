// PaymentTabs.jsx
import React, { useState } from 'react';
import PendingPayments from './PendingPayments';
import PaymentHistory from './PaymentHistory';
import Avatar from 'react-avatar';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../../images/logoImage.jpeg'; 

const PaymentTabs = () => {
    const [activeTab, setActiveTab] = useState('due');
    const navigate = useNavigate();

    const handleNavigation = () => {
      navigate('/user/dashboard');
    };

    return (
        <>
           {/* Navigation Bar */}
      <nav className="bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo Image with navigation */}
            <img
              src={LoginImage}
              alt="CountryClean.LK"
              className="mr-3 h-16 cursor-pointer"
              onClick={handleNavigation}
            />
            <h1
              className="text-xl font-bold cursor-pointer"
              onClick={handleNavigation}
            >
              CountryClean.LK
            </h1>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/FetchBin')}
              className="rounded-md px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-blue-500 hover:text-white"
            >
              Manage Bin
            </button>
            <button
              onClick={() => navigate('/additional-pickups')}
              className="rounded-md px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-blue-500 hover:text-white"
            >
              View Schedule
            </button>
            <button
              onClick={() => navigate('/payments')}
              className="rounded-md px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-blue-500 hover:text-white"
            >
              Payments
            </button>
          </div>
        </div>
      </nav>

            {/* main section */}
            <div className="container mx-auto max-w-4xl p-4">
                <div className="mb-8">
                    <h1 className="mb-2 text-2xl font-bold text-gray-800">💵 Payment Management</h1>
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
                                Due Payments ⏱️
                            </button>
                            <span className="mb-2 mt-2 h-10 border-x-4 border-slate-400 px-1"></span>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`border-b-2 px-1 py-4 text-sm font-medium ${
                                    activeTab === 'history'
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Payment History 📜
                            </button>
                        </nav>
                    </div>
                </div>

                {activeTab === 'due' ? <PendingPayments /> : <PaymentHistory />}
            </div>

             {/* Footer */}
             <footer className="bg-white p-4 text-center shadow-md">
                <p className="text-gray-600">© 2024 CountryClean.LK. All rights reserved.</p>
                <p className="text-gray-600">
                    Follow us on{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Facebook
                    </a>
                    ,{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Twitter
                    </a>
                    ,{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Instagram
                    </a>
                </p>
            </footer>
        </>
    );
};
export default PaymentTabs;
