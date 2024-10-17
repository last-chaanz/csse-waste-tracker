import React, { useState } from 'react';

// PaymentPortal.jsx
const PaymentPortal = ({ payment, onClose }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate payment processing
        setTimeout(() => {
            alert('Payment processed successfully!');
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50">
            <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
                <div className="mt-3">
                    <h3 className="mb-4 text-lg font-medium text-gray-900">Payment Portal</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={`rounded p-2 text-sm font-medium ${
                                paymentMethod === 'card'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Credit Card
                        </button>
                        <button
                            onClick={() => setPaymentMethod('paypal')}
                            className={`rounded p-2 text-sm font-medium ${
                                paymentMethod === 'paypal'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            PayPal
                        </button>
                    </div>

                    {paymentMethod === 'card' ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                <input
                                    type="text"
                                    placeholder="1234 1234 1234 1234"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CVC</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-md bg-blue-600 p-2 text-white transition duration-150 ease-in-out hover:bg-blue-700"
                            >
                                Pay ${payment.amount.toFixed(2)}
                            </button>
                        </form>
                    ) : (
                        <div className="p-4 text-center">
                            <button
                                onClick={handleSubmit}
                                className="w-full rounded-md bg-blue-600 p-2 text-white transition duration-150 ease-in-out hover:bg-blue-700"
                            >
                                Pay with PayPal
                            </button>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="mt-4 w-full rounded-md bg-gray-100 p-2 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPortal;
