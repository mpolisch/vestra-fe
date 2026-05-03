import axios from 'axios';
import { BackendError } from '@/types/api';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('Missing required env var: NEXT_PUBLIC_API_URL');
}

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Required for httpOnly cookies
});

// Normalize the error message from the backend's { status: 'error', message } shape
// onto the AxiosError itself — but preserve the full AxiosError structure so
// components can still inspect status codes (401 vs 429 vs 500).
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError<BackendError>(error) && error.response?.data?.message) {
            error.message = error.response.data.message;
        }
        return Promise.reject(error);
    },
);
