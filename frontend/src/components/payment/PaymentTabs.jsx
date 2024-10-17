// PaymentTabs.jsx
import React, { useState } from 'react';
import PendingPayments from './PendingPayments';
import PaymentHistory from './PaymentHistory';

const PaymentTabs = () => {
    const [activeTab, setActiveTab] = useState('due');

    return (
        <div className="container mx-auto max-w-4xl p-4">
            <div className="mb-8">
                <h1 className="mb-2 text-2xl font-bold text-gray-800">Payment Management</h1>
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('due')}
                            className={`border-b-2 px-1 py-4 text-sm font-medium ${
                                activeTab === 'due'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            Due Payments
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`border-b-2 px-1 py-4 text-sm font-medium ${
                                activeTab === 'history'
                                    ? 'border-blue-500 text-blue-600'
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
    );
};

// PendingPayments.jsx
// const PendingPayments = () => {
//     const [showPortal, setShowPortal] = useState(false);
//     const [selectedPayment, setSelectedPayment] = useState(null);

//     // Dummy data for pending payments
//     const dummyPendingPayments = [
//         {
//             _id: '1',
//             pickupDate: '2024-10-20',
//             location: '123 Main St, City',
//             wasteType: 'Food',
//             amount: 25.0,
//             binId: 'BIN001',
//         },
//         {
//             _id: '2',
//             pickupDate: '2024-10-22',
//             location: '456 Park Ave, City',
//             wasteType: 'Recyclable Waste',
//             amount: 30.0,
//             binId: 'BIN002',
//         },
//         {
//             _id: '3',
//             pickupDate: '2024-10-25',
//             location: '789 Oak Rd, City',
//             wasteType: 'Non Recyclable Waste',
//             amount: 35.0,
//             binId: 'BIN003',
//         },
//     ];

//     return (
//         <div>
//             {showPortal ? (
//                 <PaymentPortal payment={selectedPayment} onClose={() => setShowPortal(false)} />
//             ) : (
//                 <div className="space-y-4">
//                     {dummyPendingPayments.map((payment) => (
//                         <div key={payment._id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
//                             <div className="flex items-start justify-between">
//                                 <div className="space-y-2">
//                                     <div className="flex items-center space-x-2">
//                                         <span className="text-sm font-medium text-gray-500">Bin ID:</span>
//                                         <span className="text-sm text-gray-900">{payment.binId}</span>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                         <span className="text-sm font-medium text-gray-500">Pickup Date:</span>
//                                         <span className="text-sm text-gray-900">
//                                             {new Date(payment.pickupDate).toLocaleDateString()}
//                                         </span>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                         <span className="text-sm font-medium text-gray-500">Location:</span>
//                                         <span className="text-sm text-gray-900">{payment.location}</span>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                         <span className="text-sm font-medium text-gray-500">Waste Type:</span>
//                                         <span className="text-sm text-gray-900">{payment.wasteType}</span>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                         <span className="text-sm font-medium text-gray-500">Amount:</span>
//                                         <span className="text-sm font-semibold text-gray-900">${payment.amount.toFixed(2)}</span>
//                                     </div>
//                                 </div>
//                                 <button
//                                     onClick={() => {
//                                         setSelectedPayment(payment);
//                                         setShowPortal(true);
//                                     }}
//                                     className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700"
//                                 >
//                                     Pay Now
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// PaymentPortal.jsx
// const PaymentPortal = ({ payment, onClose }) => {
//     const [paymentMethod, setPaymentMethod] = useState('card');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Simulate payment processing
//         setTimeout(() => {
//             alert('Payment processed successfully!');
//             onClose();
//         }, 1000);
//     };

//     return (
//         <div className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50">
//             <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
//                 <div className="mt-3">
//                     <h3 className="mb-4 text-lg font-medium text-gray-900">Payment Portal</h3>
//                     <div className="mb-4 grid grid-cols-2 gap-4">
//                         <button
//                             onClick={() => setPaymentMethod('card')}
//                             className={`rounded p-2 text-sm font-medium ${
//                                 paymentMethod === 'card'
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             }`}
//                         >
//                             Credit Card
//                         </button>
//                         <button
//                             onClick={() => setPaymentMethod('paypal')}
//                             className={`rounded p-2 text-sm font-medium ${
//                                 paymentMethod === 'paypal'
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             }`}
//                         >
//                             PayPal
//                         </button>
//                     </div>

//                     {paymentMethod === 'card' ? (
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Card Number</label>
//                                 <input
//                                     type="text"
//                                     placeholder="1234 1234 1234 1234"
//                                     className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
//                                 />
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
//                                     <input
//                                         type="text"
//                                         placeholder="MM/YY"
//                                         className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">CVC</label>
//                                     <input
//                                         type="text"
//                                         placeholder="123"
//                                         className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
//                                     />
//                                 </div>
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="w-full rounded-md bg-blue-600 p-2 text-white transition duration-150 ease-in-out hover:bg-blue-700"
//                             >
//                                 Pay ${payment.amount.toFixed(2)}
//                             </button>
//                         </form>
//                     ) : (
//                         <div className="p-4 text-center">
//                             <button
//                                 onClick={handleSubmit}
//                                 className="w-full rounded-md bg-blue-600 p-2 text-white transition duration-150 ease-in-out hover:bg-blue-700"
//                             >
//                                 Pay with PayPal
//                             </button>
//                         </div>
//                     )}

//                     <button
//                         onClick={onClose}
//                         className="mt-4 w-full rounded-md bg-gray-100 p-2 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-200"
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// PaymentHistory.jsx
// const PaymentHistory = () => {
//     // Dummy data for payment history
//     const dummyPaymentHistory = [
//         {
//             _id: '1',
//             paymentDate: '2024-10-15',
//             amount: 25.0,
//             paymentMethod: 'Card',
//             transactionId: 'TXN123456',
//             paymentStatus: 'Completed',
//             pickupDetails: {
//                 location: '123 Main St, City',
//                 wasteType: 'Food',
//             },
//         },
//         {
//             _id: '2',
//             paymentDate: '2024-10-10',
//             amount: 30.0,
//             paymentMethod: 'PayPal',
//             transactionId: 'TXN789012',
//             paymentStatus: 'Completed',
//             pickupDetails: {
//                 location: '456 Park Ave, City',
//                 wasteType: 'Recyclable Waste',
//             },
//         },
//         {
//             _id: '3',
//             paymentDate: '2024-10-05',
//             amount: 35.0,
//             paymentMethod: 'Card',
//             transactionId: 'TXN345678',
//             paymentStatus: 'Completed',
//             pickupDetails: {
//                 location: '789 Oak Rd, City',
//                 wasteType: 'Non Recyclable Waste',
//             },
//         },
//     ];

//     return (
//         <div className="space-y-4">
//             {dummyPaymentHistory.map((payment) => (
//                 <div key={payment._id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-sm font-medium text-gray-500">Payment Date:</span>
//                                 <span className="text-sm text-gray-900">
//                                     {new Date(payment.paymentDate).toLocaleDateString()}
//                                 </span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-sm font-medium text-gray-500">Amount:</span>
//                                 <span className="text-sm text-gray-900">${payment.amount.toFixed(2)}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-sm font-medium text-gray-500">Payment Method:</span>
//                                 <span className="text-sm text-gray-900">{payment.paymentMethod}</span>
//                             </div>
//                         </div>
//                         <div className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-sm font-medium text-gray-500">Transaction ID:</span>
//                                 <span className="text-sm text-gray-900">{payment.transactionId}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-sm font-medium text-gray-500">Status:</span>
//                                 <span className="text-sm text-gray-900">{payment.paymentStatus}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-sm font-medium text-gray-500">Location:</span>
//                                 <span className="text-sm text-gray-900">{payment.pickupDetails.location}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export { PaymentTabs, PendingPayments, PaymentPortal, PaymentHistory };
export default PaymentTabs;
