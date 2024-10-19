// PaymentTabs.jsx
import React, { useState } from 'react';
import PendingPayments from './PendingPayments';
import PaymentHistory from './PaymentHistory';
import Avatar from 'react-avatar';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../../images/logoImage.jpeg';
import NavBar from '../common/Navbar';
import Footer from '../common/Footer';

const PaymentTabs = () => {
    const [activeTab, setActiveTab] = useState('due');
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/user/dashboard');
    };

    return (
        <>
            <NavBar />

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

            <Footer />
        </>
    );
};
export default PaymentTabs;
