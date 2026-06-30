import instance from './instance';

export const getApi = async (url, payload, token) => {
    const config = {
        params: payload,
    };
    if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
    }
    const response = await instance.get(url, config);
    return response.data;
};

export const postApi = async (url, payload, token) => {
    const config = {};
    if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
    }
    const response = await instance.post(url, payload, config);
    return response.data;
};

export const putApi = async (url, payload, token) => {
    const config = {};
    if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
    }
    const response = await instance.put(url, payload, config);
    return response.data;
};

export const deleteApi = async (url, payload, token) => {
    const config = {
        data: payload,
    };
    if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
    }
    const response = await instance.delete(url, config);
    return response.data;
};

export default instance;
