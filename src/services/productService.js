import * as publicRequest from '@/utils/public-request';
import * as authorizationRequest from '@/utils/authorization-request';
import store from '../redux/store';

/** PUBLIC */

export const getCategoriesService = async () => {
    const path = 'category/get';

    const payload = {};

    try {
        const result = await publicRequest.getApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const getMaterialsService = async () => {
    const path = 'material/get';

    const payload = {};

    try {
        const result = await publicRequest.getApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const getProductsCountService = async () => {
    const path = 'product/count';

    const payload = {};

    try {
        const result = await publicRequest.getApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const getProductsService = async (categories, page) => {
    const path = 'product/get';

    const payload = {
        categories,
        page,
    };

    try {
        const result = await publicRequest.getApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const getColorsService = async () => {
    const path = 'color/get';

    const payload = {};

    try {
        const result = await publicRequest.getApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const searchProductsService = async (keyword, page) => {
    const path = 'product/search';

    const payload = {
        keyword,
        page,
    };

    try {
        const result = await publicRequest.getApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
        return error?.response?.data || {
            code: 'NETWORK_ERROR',
            message: 'Không thể kết nối đến máy chủ.',
            result: [],
        };
    }
};

export const getProductByIdService = async (product_id) => {
    const path = 'product/get';

    const payload = {
        product_id,
    };

    try {
        const result = await publicRequest.getApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
        return error?.response?.data || {
            code: 'NETWORK_ERROR',
            message: 'Không thể kết nối đến máy chủ.',
            result: [],
        };
    }
};

/** AUTHORIZATION */


export const createProductService = async (data) => {
    const path = 'product/create';
    const accessToken = store.getState().user.accessToken;
    const payload = data;

    try {
        const result = await authorizationRequest.postApi(path, payload, accessToken);
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

export const updateProductService = async (data) => {
    const path = 'product/update';
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
                message: 'Không thể kết nối đến máy chủ.',
            }
        );
    }
};

export const deleteProductService = async (data) => {
    const path = 'product/delete';
    const accessToken = store.getState().user.accessToken;
    const payload = data;

    try {
        const result = await authorizationRequest.deleteApi(path, payload, accessToken);
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

export const createCatalogOptionService = async (data) => {
    const path = 'catalog-option/create';
    const accessToken = store.getState().user.accessToken;

    try {
        const result = await authorizationRequest.postApi(path, data, accessToken);
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

export const updateCatalogOptionService = async (data) => {
    const path = 'catalog-option/update';
    const accessToken = store.getState().user.accessToken;

    try {
        const result = await authorizationRequest.putApi(path, data, accessToken);
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

export const deleteCatalogOptionService = async (data) => {
    const path = 'catalog-option/delete';
    const accessToken = store.getState().user.accessToken;

    try {
        const result = await authorizationRequest.deleteApi(path, data, accessToken);
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
