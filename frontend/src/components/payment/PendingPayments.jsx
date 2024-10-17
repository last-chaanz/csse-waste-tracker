import React, { useState } from 'react';
import PaymentPortal from './PaymentPortal';

// PendingPayments.jsx
const PendingPayments = () => {
    const [showPortal, setShowPortal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    // Dummy data for pending payments
    const dummyPendingPayments = [
        {
            _id: '1',
            pickupDate: '2024-10-20',
            location: '123 Main St, City',
            wasteType: 'Food',
            amount: 25.0,
            binId: 'BIN001',
        },
        {
            _id: '2',
            pickupDate: '2024-10-22',
            location: '456 Park Ave, City',
            wasteType: 'Recyclable Waste',
            amount: 30.0,
            binId: 'BIN002',
        },
        {
            _id: '3',
            pickupDate: '2024-10-25',
            location: '789 Oak Rd, City',
            wasteType: 'Non Recyclable Waste',
            amount: 35.0,
            binId: 'BIN003',
        },
    ];

    return (
        <div>
            {showPortal ? (
                <PaymentPortal payment={selectedPayment} onClose={() => setShowPortal(false)} />
            ) : (
                <div className="space-y-4">
                    {dummyPendingPayments.map((payment) => (
                        <div key={payment._id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-500">Bin ID:</span>
                                        <span className="text-sm text-gray-900">{payment.binId}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-500">Pickup Date:</span>
                                        <span className="text-sm text-gray-900">
                                            {new Date(payment.pickupDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-500">Location:</span>
                                        <span className="text-sm text-gray-900">{payment.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-500">Waste Type:</span>
                                        <span className="text-sm text-gray-900">{payment.wasteType}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-500">Amount:</span>
                                        <span className="text-sm font-semibold text-gray-900">${payment.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedPayment(payment);
                                        setShowPortal(true);
                                    }}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700"
                                >
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingPayments;
