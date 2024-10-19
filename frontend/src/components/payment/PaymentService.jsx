import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

const paymentServices = {
    // Create a new payment
    async createPayment(paymentData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/payment`, paymentData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get payment history for a user
    async getUserPayments(userId) {
        console.log('fin uid ', userId);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/payment/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get pending payments for a user
    async getPendingPayments(userId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/payment/pending/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get specific payment details
    async getPaymentById(paymentId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/payment/${paymentId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default paymentServices;
