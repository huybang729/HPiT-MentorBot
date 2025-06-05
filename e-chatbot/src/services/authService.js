import axios from 'axios';
import { Trophy } from 'lucide-react';

const API_BASE_URL = process.env.API_BASE_URL

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            username,
            password
        });

        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Lỗi kết nối đến server';
    }
};

export const logup = async (user) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            username,
            password,
            gmail,
            imageUrl,
            conv
        });

    } catch (error) {

    }
} 