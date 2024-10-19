import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import paymentServices from './PaymentService';

// PaymentHistory.jsx
const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const userID = localStorage.getItem('userID');
                console.log(userID);
                // Get userId from your auth context/storage
                const data = await paymentServices.getUserPayments(userID);

                setPayments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Dummy data for payment history
    // const dummyPaymentHistory = [
    //     {
    //         _id: '1',
    //         paymentDate: '2024-10-15',
    //         amount: 25.0,
    //         paymentMethod: 'Card',
    //         transactionId: 'TXN123456',
    //         paymentStatus: 'Completed',
    //         pickupDetails: {
    //             location: '123 Main St, City',
    //             wasteType: 'Food',
    //         },
    //     },
    //     {
    //         _id: '2',
    //         paymentDate: '2024-10-10',
    //         amount: 30.0,
    //         paymentMethod: 'PayPal',
    //         transactionId: 'TXN789012',
    //         paymentStatus: 'Completed',
    //         pickupDetails: {
    //             location: '456 Park Ave, City',
    //             wasteType: 'Recyclable Waste',
    //         },
    //     },
    //     {
    //         _id: '3',
    //         paymentDate: '2024-10-05',
    //         amount: 35.0,
    //         paymentMethod: 'Card',
    //         transactionId: 'TXN345678',
    //         paymentStatus: 'not-Completed',
    //         pickupDetails: {
    //             location: '789 Oak Rd, City',
    //             wasteType: 'Non Recyclable Waste',
    //         },
    //     },
    // ];

    // Function to generate PDF for a specific payment
    const downloadReceipt = (payment) => {
        const doc = new jsPDF();

        // Set font size and styles
        doc.setFontSize(20);
        doc.text('Payment Receipt', 105, 20, null, null, 'center'); // Header centered

        // Add horizontal line
        doc.setLineWidth(0.5);
        doc.line(10, 25, 200, 25);

        // Section for Payment Details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Payment Date:', 10, 40);
        doc.setFont('helvetica', 'normal');
        doc.text(`${new Date(payment.paymentDate).toLocaleDateString()}`, 50, 40);

        doc.setFont('helvetica', 'bold');
        doc.text('Amount:', 10, 50);
        doc.setFont('helvetica', 'normal');
        doc.text(`$${payment.amount.toFixed(2)}`, 50, 50);

        doc.setFont('helvetica', 'bold');
        doc.text('Payment Method:', 10, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(`${payment.paymentMethod}`, 50, 60);

        // Add another line for separation
        doc.line(10, 70, 200, 70);

        // Section for Transaction Details
        doc.setFont('helvetica', 'bold');
        doc.text('Transaction ID:', 10, 80);
        doc.setFont('helvetica', 'normal');
        doc.text(`${payment.transactionId}`, 50, 80);

        doc.setFont('helvetica', 'bold');
        doc.text('Payment Status:', 10, 90);
        doc.setFont('helvetica', 'normal');
        doc.text(`${payment.paymentStatus}`, 50, 90);

        // Section for Pickup Details
        doc.setFont('helvetica', 'bold');
        doc.text('Pickup Location:', 10, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(`${payment.additionalPickupId.location}`, 50, 100);

        doc.setFont('helvetica', 'bold');
        doc.text('Waste Type:', 10, 110);
        doc.setFont('helvetica', 'normal');
        doc.text(`${payment.additionalPickupId.wasteType}`, 50, 110);

        // Add a footer or final message
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for your payment!', 105, 130, null, null, 'center');

        // Save the PDF with a dynamic name
        doc.save(`receipt_${payment.transactionId}.pdf`);
    };

    return (
        <div className="space-y-4">
            {payments.map((payment) => (
                <div
                    key={payment._id}
                    className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,100,0,0.3)]"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">📅 Payment Date:</span>
                                <span className="text-sm text-gray-900">
                                    {new Date(payment.paymentDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">💲Amount:</span>
                                <span className="text-sm text-gray-900">LKR {payment.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">💵 Payment Method:</span>
                                <span className="text-sm text-gray-900">{payment.paymentMethod}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">𝄃𝄃𝄂𝄀𝄁𝄃𝄂𝄂𝄃 Transaction ID:</span>
                                <span className="text-sm text-gray-900">{payment.transactionId}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">
                                    {payment.paymentStatus === 'Completed' ? '🟢' : '🔴'}Status:
                                </span>
                                <span className="text-sm text-gray-900">{payment.paymentStatus}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500">📍Location:</span>
                                <span className="text-sm text-gray-900">{payment.additionalPickupId.location}</span>
                            </div>

                            {/* Button to download the receipt */}
                            <div className="flex items-end space-x-2">
                                <button
                                    className="right-0 ml-auto rounded bg-blue-400 px-2 py-2 font-mono text-sm font-semibold text-white hover:bg-blue-600"
                                    onClick={() => downloadReceipt(payment)}
                                >
                                    Download Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PaymentHistory;
