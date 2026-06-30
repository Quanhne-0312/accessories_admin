import * as publicRequest from '@/utils/public-request';
import * as authorizationRequest from '@/utils/authorization-request';
import store from '../redux/store';

/** PUBLIC */

export const loginService = async (username, password) => {
    const path = 'auth/user/login';
    const payload = {
        username,
        password,
    };
    try {
        const result = await publicRequest.postApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
        return (
            error?.response?.data || {
                code: 'NETWORK_ERROR',
                message: 'Không thể kết nối đến máy chủ.',
            }
        );
    }
};

/** AUTHORIZATION */

export const logoutService = async (phone_number) => {
    const path = 'auth/user/logout';
    const payload = {
        phone_number,
    };
    try {
        const result = await authorizationRequest.postApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
        return (
            error?.response?.data || {
                code: 'NETWORK_ERROR',
                message: 'KhÃ´ng thá»ƒ káº¿t ná»‘i Ä‘áº¿n mÃ¡y chá»§.',
            }
        );
    }
};

export const refreshTokensService = async () => {
    const path = 'auth/user/refresh';
    const refreshToken = store.getState().user.refreshToken;
    if (!refreshToken) {
        return {
            code: 'AUTHORIZATION_ERROR',
            message: 'Refresh token is missing.',
        };
    }

    const payload = {
        'x-refresh-token': refreshToken,
    };
    try {
        const result = await authorizationRequest.postApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
        return (
            error?.response?.data || {
                code: 'NETWORK_ERROR',
                message: 'KhÃ´ng thá»ƒ káº¿t ná»‘i Ä‘áº¿n mÃ¡y chá»§.',
            }
        );
    }
};

export const updateProfileService = async (data) => {
    const path = 'auth/user/update-profile';
    const accessToken = store.getState().user.accessToken;
    const payload = data;

    try {
        const result = await authorizationRequest.putApi(path, payload, accessToken);
        return result;
    } catch (error) {
        console.log(error);
        return (
            error?.response?.data || {
                code: 'NETWORK_ERROR',
                message: 'KhÃ´ng thá»ƒ káº¿t ná»‘i Ä‘áº¿n mÃ¡y chá»§.',
            }
        );
    }
};
