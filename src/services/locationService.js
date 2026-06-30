import axios from 'axios';

const request = axios.create({
    baseURL: 'https://provinces.open-api.vn/api/v1',
    timeout: 10000,
});

export const getApi = async (url, payload = {}, token) => {
    const config = {
        params: payload,
    };

    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`,
        };
    }

    const response = await request.get(url, config);
    return response.data;
};

/** PROVINCES */

export const getProvincesService = async () => {
    try {
        return await getApi('/p');
    } catch (error) {
        console.error('Get Provinces Error:', error);
        return [];
    }
};

/** DISTRICTS */

export const getDistrictsService = async (provinceCode) => {
    try {
        const result = await getApi(`/p/${provinceCode}`, {
            depth: 2,
        });

        return result?.districts || [];
    } catch (error) {
        console.error('Get Districts Error:', error);
        return [];
    }
};

/** WARDS */

export const getWardsService = async (districtCode) => {
    try {
        const result = await getApi(`/d/${districtCode}`, {
            depth: 2,
        });

        return result?.wards || [];
    } catch (error) {
        console.error('Get Wards Error:', error);
        return [];
    }
};

export default {
    getProvincesService,
    getDistrictsService,
    getWardsService,
};