import { logout, mapTokens } from '@/redux/actions/userAction';
import store from '@/redux/store';
import axios from 'axios';

const baseURL =
    import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_DEVELOPMENT_SERVER_URL
        : import.meta.env.VITE_PRODUCTION_SERVER_URL;

const instance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().user.accessToken;
        config.headers = config.headers || {};
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        if (err.response) {
            const isRefreshRequest = originalConfig?.url?.includes('/auth/user/refresh');
            if (err.response.status === 401 && !originalConfig._retry && !isRefreshRequest) {
                const currentRefreshToken = store.getState().user.refreshToken;
                if (!currentRefreshToken) {
                    store.dispatch(logout());
                    return Promise.reject(err);
                }

                originalConfig._retry = true;

                try {
                    const res = await axios.post(`${baseURL}auth/user/refresh`, {
                        'x-refresh-token': currentRefreshToken,
                    });
                    const { accessToken, refreshToken } = res.data;
                    store.dispatch(mapTokens(accessToken, refreshToken));
                    return instance(originalConfig);
                } catch (_error) {
                    store.dispatch(logout());
                    return Promise.reject(_error);
                }
            }

            if (err.response.status === 401 && isRefreshRequest) {
                store.dispatch(logout());
            }
        }
        return Promise.reject(err);
    },
);

export default instance;
