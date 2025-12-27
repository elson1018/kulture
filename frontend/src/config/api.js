// Centralized API configuration
// Change this when deploying to production

export const API_BASE = 'http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api';

// Individual endpoint helpers (optional, for convenience)
export const ENDPOINTS = {
    CART: `${API_BASE}/cart`,
    PRODUCTS: `${API_BASE}/products`,
    TUTORIALS: `${API_BASE}/tutorials`,
    AUTH_LOGIN: `${API_BASE}/auth/login`,
    AUTH_REGISTER: `${API_BASE}/auth/register`,
    SALES: `${API_BASE}/sales`,
    PROFILE_UPDATE: `${API_BASE}/profile/update`,
};
