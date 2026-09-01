import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.151.11.36:5001';

export const getDashboardSummary = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        console.log('🔑 Token for summary:', token ? '✅ Found' : '❌ Not found');

        if (!token) {
            throw new Error('NO_TOKEN');
        }

        const response = await fetch(`${API_URL}/api/dashboard/summary`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('📡 Summary Status:', response.status);

        const data = await response.json();
        console.log('📥 Summary Data:', data);
        return data;

    } catch (error) {
        console.error('❌ Dashboard Summary Error:', error);
        throw error;
    }
};

export const getRecentTransactions = async (limit = 5) => {
    try {
        const token = await AsyncStorage.getItem('token');
        console.log('🔑 Token for recent:', token ? '✅ Found' : '❌ Not found');

        if (!token) {
            throw new Error('NO_TOKEN');
        }

        const response = await fetch(`${API_URL}/api/dashboard/recent?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('📡 Recent Status:', response.status);

        const data = await response.json();
        console.log('📥 Recent Data:', data);
        return data;

    } catch (error) {
        console.error('❌ Recent Transactions Error:', error);
        throw error;
    }
};