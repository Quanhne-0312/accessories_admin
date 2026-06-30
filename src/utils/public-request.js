import axios from 'axios';

const request = axios.create({
    baseURL:
        import.meta.env.MODE === 'development'
            ? import.meta.env.VITE_DEVELOPMENT_SERVER_URL
            : import.meta.env.VITE_PRODUCTION_SERVER_URL,
});

export const getApi = async (url, payload) => {
    const config = {
        params: payload,
    };

    const response = await request.get(url, config);
    return response.data;
};

export const postApi = async (url, payload) => {
    const response = await request.post(url, payload);
    return response.data;
};

export const putApi = async (url, payload) => {
    const response = await request.put(url, payload);
    return response.data;
};

export const deleteApi = async (url, payload) => {
    const config = {
        data: payload,
    };

    const response = await request.delete(url, config);
    return response.data;
};

export default request;
