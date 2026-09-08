import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { navigate } from './navigationRef';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isLoggingOut = false;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401 && !isLoggingOut) {
            isLoggingOut = true;
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            navigate('LoginScreen');
            setTimeout(() => { isLoggingOut = false; }, 2000);
        }
        return Promise.reject(error);
    }
);

export default api;
