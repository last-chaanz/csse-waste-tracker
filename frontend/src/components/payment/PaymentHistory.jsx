import React from 'react';

// PaymentHistory.jsx
const PaymentHistory = () => {
    // Dummy data for payment history
    const dummyPaymentHistory = [
        {
            _id: '1',
            paymentDate: '2024-10-15',
            amount: 25.0,
            paymentMethod: 'Card',
            transactionId: 'TXN123456',
            paymentStatus: 'Completed',
            pickupDetails: {
                location: '123 Main St, City',
                wasteType: 'Food',
            },
        },
        {
            _id: '2',
            paymentDate: '2024-10-10',
            amount: 30.0,
            paymentMethod: 'PayPal',
            transactionId: 'TXN789012',
            paymentStatus: 'Completed',
            pickupDetails: {
                location: '456 Park Ave, City',
                wasteType: 'Recyclable Waste',
            },
        },
        {
            _id: '3',
            paymentDate: '2024-10-05',
            amount: 35.0,
            paymentMethod: 'Card',
            transactionId: 'TXN345678',
            paymentStatus: 'Completed',
            pickupDetails: {
                location: '789 Oak Rd, City',
                wasteType: 'Non Recyclable Waste',
            },
        },
    ];

    return (
        <div className="space-y-4">
            {dummyPaymentHistory.map((payment) => (
                <div key={payment._id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">Payment Date:</span>
                                <span className="text-sm text-gray-900">
                                    {new Date(payment.paymentDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">Amount:</span>
                                <span className="text-sm text-gray-900">${payment.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">Payment Method:</span>
                                <span className="text-sm text-gray-900">{payment.paymentMethod}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">Transaction ID:</span>
                                <span className="text-sm text-gray-900">{payment.transactionId}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">Status:</span>
                                <span className="text-sm text-gray-900">{payment.paymentStatus}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">Location:</span>
                                <span className="text-sm text-gray-900">{payment.pickupDetails.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PaymentHistory;
