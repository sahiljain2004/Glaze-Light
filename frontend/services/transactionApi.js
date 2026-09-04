import api from './api';

export const getTransactions = async () => {
    try {
        const response = await api.get('/api/transactions');
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch');
        }
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const createTransaction = async (transactionData) => {
    try {
        const response = await api.post('/api/transactions', transactionData);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to create transaction');
        }
        return response.data;
    } catch (error) {
        console.error('Create Error:', error);
        throw error;
    }
};

export const updateTransaction = async (id, transactionData) => {
    try {
        const response = await api.put(`/api/transactions/${id}`, transactionData);
        return response.data;
    } catch (error) {
        console.error('Update Error:', error);
        throw error;
    }
};

export const deleteTransaction = async (id) => {
    try {
        const response = await api.delete(`/api/transactions/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
};

export const searchTransactions = async (query) => {
    try {
        const response = await api.get(`/api/transactions/search?q=${encodeURIComponent(query)}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to search');
        }
        return response.data;
    } catch (error) {
        console.error('Search Error:', error);
        throw error;
    }
};
