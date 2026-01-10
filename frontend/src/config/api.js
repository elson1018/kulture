export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8082/api';

export const ENDPOINTS = {
    CART: `${API_BASE}/cart`,
    PRODUCTS: `${API_BASE}/products`,
    TUTORIALS: `${API_BASE}/tutorials`,
    AUTH_LOGIN: `${API_BASE}/auth/login`,
    AUTH_REGISTER: `${API_BASE}/auth/register`,
    AUTH_STATUS: `${API_BASE}/auth/status`,
    SALES: `${API_BASE}/sales`,
    PROFILE_UPDATE: `${API_BASE}/profile/update`,
    REVIEWS: `${API_BASE}/reviews`,
};