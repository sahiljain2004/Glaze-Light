import api from './api';

export const getDashboardSummary = async () => {
    try {
        const response = await api.get('/api/dashboard/summary');
        return response.data;
    } catch (error) {
        console.error('Dashboard Summary Error:', error);
        throw error;
    }
};

export const getRecentTransactions = async (limit = 5) => {
    try {
        const response = await api.get(`/api/dashboard/recent?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Recent Transactions Error:', error);
        throw error;
    }
};
