import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

let authToken = null;
let unauthorizedHandler = null;

export const setAuthToken = (token) => {
  authToken = token || null;
};

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

apiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    const message =
      error?.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const fetchServices = () => apiClient.get('/services');

export const fetchOperators = (params) => apiClient.get('/operators', { params });

export const fetchOperatorPlans = (code, identifier) =>
  apiClient.get(`/operators/${encodeURIComponent(code)}/plans`, {
    params: identifier ? { identifier } : undefined,
  });

export const initiateRecharge = (payload) => apiClient.post('/recharge', payload);

export const fetchRechargeStatus = (transactionId) =>
  apiClient.get(`/recharge/${encodeURIComponent(transactionId)}`);

export const fetchRechargeHistory = (params) =>
  apiClient.get('/recharge/history', { params });

export const retryRecharge = (transactionId) =>
  apiClient.post(`/recharge/retry/${encodeURIComponent(transactionId)}`);

export const fetchRechargeSummary = () => apiClient.get('/recharge/summary/metrics');

export const login = (payload) => apiClient.post('/auth/login', payload);

export const signup = (payload) => apiClient.post('/auth/signup', payload);

export const fetchCurrentUser = () => apiClient.get('/auth/me');

export default apiClient;
