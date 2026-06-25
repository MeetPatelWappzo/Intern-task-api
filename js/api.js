export const API_BASE_URL = 'http://localhost:5002'; // Change to Render URL in production

export function getAccessToken() {
    return localStorage.getItem('accessToken');
}

export function setAccessToken(token) {
    localStorage.setItem('accessToken', token);
}

export function clearAccessToken() {
    localStorage.removeItem('accessToken');
}

/**
 * Reusable fetch wrapper that automatically injects the Authorization header
 * @param {string} endpoint - The API endpoint (e.g. '/api/tasks')
 * @param {Object} options - Standard fetch options
 */
export async function fetchWithAuth(endpoint, options = {}) {
    const token = getAccessToken();
    const headers = {
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Automatically set Content-Type to application/json if not FormData
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const config = {
        ...options,
        headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (response.status === 401) {
        clearAccessToken();
        if (window.location.pathname.indexOf('login.html') === -1) {
            window.location.href = 'login.html';
        }
    }
    return response;
}
