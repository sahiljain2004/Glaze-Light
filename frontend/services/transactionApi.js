import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://10.151.11.36:5001';
// Get token
const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        console.log('🔑 getToken called, token:', token ? '✅ Found' : '❌ Not found');

        if (!token) {
            console.log('❌ No token in AsyncStorage');
            return null;
        }

        console.log('✅ Token retrieved successfully');
        return token;
    } catch (error) {
        console.error('❌ Error getting token:', error);
        return null;
    }
};

// GET all transactions
export const getTransactions = async () => {
    try {
        console.log('📡 getTransactions called');

        const token = await getToken();

        if (!token) {
            console.log('❌ No token, throwing NO_TOKEN');
            throw new Error('NO_TOKEN');
        }

        console.log('📡 Making API call with token:', token.substring(0, 20) + '...');

        const response = await fetch(`${API_URL}/api/transactions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // 🔥 Bearer + space + token
                'Content-Type': 'application/json',
            },
        });

        console.log('📡 Response status:', response.status);

        const data = await response.json();
        console.log('📡 Response data:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch');
        }

        return data;

    } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
    }
};

// ✅ CREATE Transaction
export const createTransaction = async (transactionData) => {
    try {
        console.log('📝 createTransaction called');
        console.log('📝 Data:', transactionData);

        const token = await getToken();

        if (!token) {
            console.log('❌ No token, throwing NO_TOKEN');
            throw new Error('NO_TOKEN');
        }

        console.log('📝 Making API call with token:', token.substring(0, 20) + '...');

        const response = await fetch(`${API_URL}/api/transactions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,  // 🔥 Bearer + space + token
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
        });

        console.log('📝 Response status:', response.status);

        const data = await response.json();
        console.log('📝 Response data:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create transaction');
        }

        return data;

    } catch (error) {
        console.error('❌ Create Error:', error);
        throw error;
    }
};

// UPDATE transaction
// Add this function
export const updateTransaction = async (id, transactionData) => {
    try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error('NO_TOKEN');
        }

        const response = await fetch(`${API_URL}/api/transactions/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('❌ Update Error:', error);
        throw error;
    }
};

// DELETE transaction
export const deleteTransaction = async (id) => {
    try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/transactions/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
};

// SEARCH transactions
// ✅ SEARCH TRANSACTIONS
export const searchTransactions = async (query) => {
    try {
        console.log('🔍 Searching transactions with query:', query);

        const token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error('NO_TOKEN');
        }

        const response = await fetch(`${API_URL}/api/transactions/search?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('📥 Search Response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Failed to search');
        }

        return data;

    } catch (error) {
        console.error('❌ Search Error:', error);
        throw error;
    }
};