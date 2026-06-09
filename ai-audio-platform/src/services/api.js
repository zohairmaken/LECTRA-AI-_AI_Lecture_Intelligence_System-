import axios from 'axios';

// Split timeouts: 10s for metadata/auth (fast failure), 5m for uploads (heavy lift)
const DEFAULT_TIMEOUT = 10000;
const UPLOAD_TIMEOUT = 300000; 

// Resolve backend URL with optional local storage override for development/remote debugging
const getBaseURL = () => {
    const override = localStorage.getItem('LECTRA_API_URL');
    if (override) {
        console.warn(`[Lectra-AI] Using API Override: ${override}`);
        return override;
    }
    return '/api/v1/';
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: DEFAULT_TIMEOUT, 
});

// ---------- Automatic Retry on Network Errors ----------
// When the backend restarts, the frontend gets ERR_NETWORK for a few seconds.
// This interceptor silently retries up to 3 times with a delay, so the user
// never sees a CONNECTION_FAILURE during normal restarts.
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds between retries

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        // Only retry on network errors (server unreachable) or 502/503/504
        const isNetworkError = !error.response && error.code === 'ERR_NETWORK';
        const isServerRestarting = error.response && [502, 503, 504].includes(error.response.status);

        if ((isNetworkError || isServerRestarting) && (!config._retryCount || config._retryCount < MAX_RETRIES)) {
            config._retryCount = (config._retryCount || 0) + 1;
            console.warn(`[Lectra-AI] Server not ready, retrying (${config._retryCount}/${MAX_RETRIES}) in ${RETRY_DELAY_MS / 1000}s...`);
            await sleep(RETRY_DELAY_MS);
            return api(config);
        }

        // Log non-retryable errors normally
        console.error(`[Lectra-AI] API Error [${error.response?.status || 'NETWORK'}]:`, error.response?.data || error.message);
        if (error.response?.status === 401) {
            console.warn("[Lectra-AI] AUTH_EXPIRED: Redirecting to login...");
        }
        return Promise.reject(error);
    }
);

// Request Interceptor (Add Token)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export const auth = {
    login: (username, password, config = {}) => {
        // OAuth2PasswordRequestForm standard expects x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        return api.post('auth/token', params, {
            ...config,
            headers: {
                ...config.headers,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },
    register: (email, password, full_name, config = {}) => api.post('auth/register', { email, password, full_name }, config),
    getMe: (config = {}) => api.get('auth/me', config),
    logout: () => localStorage.removeItem('token'),
};

export const lectures = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('lectures/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: UPLOAD_TIMEOUT
        });
    },
    getAll: () => api.get('lectures/'),
    getOne: (id) => api.get(`lectures/${id}`),
    getStatus: (id) => api.get(`lectures/${id}/status`),
};

export const chat = {
    sendMessage: (lectureId, message) => api.post('chat/', { lecture_id: lectureId, message }),
};

export const quiz = {
    getAll: () => api.get('quiz/'),
};

export default api;
