import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.151.11.36:5001';

// ✅ CREATE ITEM
export const createItem = async (itemData) => {
    try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error('NO_TOKEN');
        }

        const response = await fetch(`${API_URL}/api/items`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('❌ Create Item Error:', error);
        throw error;
    }
};

// ✅ GET ALL ITEMS
export const getItems = async () => {
    try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error('NO_TOKEN');
        }

        const response = await fetch(`${API_URL}/api/items`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('❌ Get Items Error:', error);
        throw error;
    }
};

// ✅ UPDATE ITEM
export const updateItem = async (id, itemData) => {
    try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error('NO_TOKEN');
        }

        const response = await fetch(`${API_URL}/api/items/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('❌ Update Item Error:', error);
        throw error;
    }
};

// ✅ DELETE ITEM
export const deleteItem = async (id) => {
    try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error('NO_TOKEN');
        }

        const response = await fetch(`${API_URL}/api/items/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('❌ Delete Item Error:', error);
        throw error;
    }
};

// ✅ UPDATE ITEM STOCK
export const updateItemStock = async (itemId, quantity, itemName) => {
    try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error('NO_TOKEN');
        }

        const response = await fetch(`${API_URL}/api/items/stock/${itemId || 'name'}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity, itemName }),
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('❌ Update Stock Error:', error);
        throw error;
    }
};

// ✅ SEARCH ITEMS (Auto-suggest)
export const searchItems = async (query) => {
    try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error('NO_TOKEN');
        }

        const response = await fetch(`${API_URL}/api/items/search?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('❌ Search Items Error:', error);
        throw error;
    }
};
