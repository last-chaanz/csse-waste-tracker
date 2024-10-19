// PaymentPortal.jsx
import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import paymentServices from './PaymentService';

const PaymentPortal = ({ payment, onClose }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const validateCardNumber = (number) => {
        const cleaned = number.replace(/\s+/g, '');
        return /^\d{16}$/.test(cleaned);
    };

    const validateExpiryDate = (date) => {
        if (!/^\d{2}\/\d{2}$/.test(date)) return false;

        const [month, year] = date.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        if (parseInt(month) < 1 || parseInt(month) > 12) return false;
        if (parseInt(year) < currentYear) return false;
        if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;

        return true;
    };

    const validateCVC = (cvc) => {
        return /^\d{3}$/.test(cvc);
    };

    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\s+/g, '');
        const parts = cleaned.match(/.{1,4}/g);
        return parts ? parts.join(' ') : cleaned;
    };

    const formatExpiryDate = (value) => {
        const cleaned = value.replace(/\D+/g, '');
        if (cleaned.length >= 2) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        }
        return cleaned;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            formattedValue = formatCardNumber(value);
        } else if (name === 'expiryDate') {
            formattedValue = formatExpiryDate(value);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: formattedValue,
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!validateCardNumber(formData.cardNumber)) {
            errors.cardNumber = 'Please enter a valid 16-digit card number';
        }

        if (!validateExpiryDate(formData.expiryDate)) {
            errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        }

        if (!validateCVC(formData.cvc)) {
            errors.cvc = 'Please enter a valid CVC (3 digits)';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (paymentMethod === 'card' && !validateForm()) {
            return;
        }

        setIsProcessing(true);

        // Simulate payment processing
        try {
            // Get from your auth context/storage
            // const userId = localStorage.getItem('userID');
            const daydiff = Math.round((new Date() - new Date(payment.pickupDate)) / (1000 * 60 * 60 * 24));
            const pamount = 1000 + daydiff * 100;

            const paymentData = {
                userId: payment.userId,
                additionalPickupId: payment._id,
                amount: pamount,
                paymentMethod: paymentMethod === 'card' ? 'Card' : 'PayPal',
            };

            await paymentServices.createPayment(paymentData);

            setShowSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setFormErrors({ submit: 'Payment failed. Please try again.' });
        } finally {
            setIsProcessing(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center bg-white p-5">
                <div className="mb-6 text-green-500">
                    <CheckCircle2 size={64} />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Payment Successful!</h2>
                <p className="mb-4 text-gray-600">Thank you for your payment...</p>
                <p className="text-sm text-gray-500">Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-white p-5">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">🟡 Payment Portal</h3>
                <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100" disabled={isProcessing}>
                    ← Back
                </button>
            </div>

            {formErrors.submit && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{formErrors.submit}</AlertDescription>
                </Alert>
            )}

            <div className="mt-6">
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setPaymentMethod('card')}
                        disabled={isProcessing}
                        className={`rounded p-2 text-sm font-medium ${
                            paymentMethod === 'card' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Credit Card 🏦
                    </button>
                    <button
                        onClick={() => setPaymentMethod('paypal')}
                        disabled={isProcessing}
                        className={`rounded p-2 text-sm font-medium ${
                            paymentMethod === 'paypal' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        PayPal 🔵
                    </button>
                </div>

                {paymentMethod === 'card' ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Card Number 💳</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                placeholder="1234 1234 1234 1234"
                                maxLength="19"
                                className={`mt-1 block w-full rounded-md border p-2 shadow-sm ${
                                    formErrors.cardNumber
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                }`}
                                disabled={isProcessing}
                            />
                            {formErrors.cardNumber && <p className="mt-1 text-sm text-red-500">{formErrors.cardNumber}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Expiry Date 📆</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    className={`mt-1 block w-full rounded-md border p-2 shadow-sm ${
                                        formErrors.expiryDate
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                    }`}
                                    disabled={isProcessing}
                                />
                                {formErrors.expiryDate && <p className="mt-1 text-sm text-red-500">{formErrors.expiryDate}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CVC ¹²³</label>
                                <input
                                    type="text"
                                    name="cvc"
                                    value={formData.cvc}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    maxLength="3"
                                    className={`mt-1 block w-full rounded-md border p-2 shadow-sm ${
                                        formErrors.cvc
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                    }`}
                                    disabled={isProcessing}
                                />
                                {formErrors.cvc && <p className="mt-1 text-sm text-red-500">{formErrors.cvc}</p>}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full rounded-md bg-green-600 p-2 text-white transition duration-150 ease-in-out hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isProcessing
                                ? 'Processing...'
                                : `Pay LKR ${(() => {
                                      const daysDifference = Math.round(
                                          (new Date() - new Date(payment.pickupDate)) / (1000 * 60 * 60 * 24),
                                      );
                                      const amount = 1000 + daysDifference * 100;

                                      return amount;
                                  })()}`}
                        </button>
                    </form>
                ) : (
                    <div className="p-4 text-center">
                        <button
                            onClick={() => {}}
                            disabled={isProcessing}
                            className="w-full rounded-md bg-green-600 p-2 text-white transition duration-150 ease-in-out hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isProcessing ? 'Processing...' : `Pay with PayPal`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPortal;
