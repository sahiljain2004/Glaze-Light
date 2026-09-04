import api from './api';

export const createItem = async (itemData) => {
    try {
        const response = await api.post('/api/items', itemData);
        return response.data;
    } catch (error) {
        console.error('Create Item Error:', error);
        throw error;
    }
};

export const getItems = async () => {
    try {
        const response = await api.get('/api/items');
        return response.data;
    } catch (error) {
        console.error('Get Items Error:', error);
        throw error;
    }
};

export const updateItem = async (id, itemData) => {
    try {
        const response = await api.put(`/api/items/${id}`, itemData);
        return response.data;
    } catch (error) {
        console.error('Update Item Error:', error);
        throw error;
    }
};

export const deleteItem = async (id) => {
    try {
        const response = await api.delete(`/api/items/${id}`);
        return response.data;
    } catch (error) {
        console.error('Delete Item Error:', error);
        throw error;
    }
};

export const updateItemStock = async (itemId, quantity, itemName) => {
    try {
        const response = await api.put(`/api/items/stock/${itemId || 'name'}`, { quantity, itemName });
        return response.data;
    } catch (error) {
        console.error('Update Stock Error:', error);
        throw error;
    }
};

export const searchItems = async (query) => {
    try {
        const response = await api.get(`/api/items/search?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Search Items Error:', error);
        throw error;
    }
};
