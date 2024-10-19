import React, { useState, useEffect } from 'react';
import PaymentPortal from './PaymentPortal';
import paymentServices from './PaymentService';

// PendingPayments.jsx
const PendingPayments = ({ onPaymentClick }) => {
    // const [showPortal, setShowPortal] = useState(false);
    // const [selectedPayment, setSelectedPayment] = useState(null);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPendingPayments = async () => {
            try {
                const userId = localStorage.getItem('userID'); // Get userId from your auth context/storage
                const data = await paymentServices.getPendingPayments(userId);
                setPendingPayments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingPayments();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Dummy data for pending payments
    const dummyPendingPayments = [
        {
            _id: '1',
            pickupDate: '2024-10-02',
            location: '123 Main St, City',
            wasteType: 'Food',
            amount: 1000.0,
            binId: 'BIN001',
        },
        {
            _id: '2',
            pickupDate: '2024-10-22',
            location: '456 Park Ave, City',
            wasteType: 'Recyclable Waste',
            amount: 800.0,
            binId: 'BIN002',
        },
        {
            _id: '3',
            pickupDate: '2024-10-25',
            location: '789 Oak Rd, City',
            wasteType: 'Non Recyclable Waste',
            amount: 600.0,
            binId: 'BIN003',
        },
    ];

    return (
        <div className="min-h-96 space-y-4">
            {pendingPayments.map((payment) => (
                <div
                    key={payment._id}
                    className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,100,0,0.2)]"
                >
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">🗑️ Bin ID:</span>
                                <span className="text-sm text-gray-900">{payment.binId}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">📅 Pickup Date:</span>
                                <span className="text-sm text-gray-900">{new Date(payment.pickupDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">📍 Location:</span>
                                <span className="text-sm text-gray-900">{payment.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">🏷️ Waste Type:</span>
                                <span className="text-sm text-gray-900">{payment.wasteType}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">💲Amount:</span>
                                {(() => {
                                    const daysDifference = Math.round(
                                        (new Date() - new Date(payment.pickupDate)) / (1000 * 60 * 60 * 24),
                                    );
                                    const amount = 1000 + daysDifference * 100;

                                    return <span className="text-sm font-semibold text-gray-900">LKR {amount}</span>;
                                })()}
                            </div>
                            <div className="flex items-center space-x-2">
                                {(() => {
                                    const daysDifference = (new Date() - new Date(payment.pickupDate)) / (1000 * 60 * 60 * 24);
                                    const isOverdue = daysDifference > 14;

                                    return (
                                        <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-orange-500'}`}>
                                            {isOverdue ? '🔴 Payment Overdue' : '🟡 Payment Due'}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                onPaymentClick(payment);
                            }}
                            className="rounded-md bg-green-800 px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-green-950"
                        >
                            Pay Now
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PendingPayments;
