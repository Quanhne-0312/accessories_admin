import * as publicRequest from '@/utils/public-request';
import * as authorizationRequest from '@/utils/authorization-request';
import store from '../redux/store';

/** PUBLIC */

export const getPaymentMethodsService = async () => {
    const path = 'payment-method/get';

    const payload = {};

    try {
        const result = await publicRequest.getApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const getOrdersCountService = async () => {
    const path = 'order/count';

    const payload = {};

    try {
        const result = await publicRequest.getApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const getOrderStatusesService = async () => {
    const path = 'status/get';
    const accessToken = store.getState().user.accessToken;

    try {
        const result = await authorizationRequest.getApi(path, {}, accessToken);
        return result;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
};

export const getOrdersService = async (status, page, keyword) => {
    const path = 'auth/order/get';
    const accessToken = store.getState().user.accessToken;

    const payload = {
        status,
        page,
        keyword,
    };

    try {
        const result = await authorizationRequest.getApi(path, payload, accessToken);
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const getOrderByIdService = async (order_id) => {
    const path = 'order/get';

    const payload = {
        order_id,
    };

    try {
        const result = await publicRequest.getApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const getOrderByUuidService = async (order_uuid) => {
    const path = 'order/get';

    const payload = {
        order_uuid,
    };

    try {
        const result = await publicRequest.getApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
};

/** AUTHORIZATION */

export const createOrderService = async (data) => {
    const path = 'order/create';
    const accessToken = store.getState().user.accessToken;

    const payload = data;

    try {
        const result = await authorizationRequest.postApi(path, payload, accessToken);
        return result;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
};

export const updateOrderService = async (data) => {
    const path = 'order/update';
    const accessToken = store.getState().user.accessToken;

    const payload = data;

    try {
        const result = await authorizationRequest.putApi(path, payload, accessToken);
        return result;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
};

export const deleteOrderService = async (data) => {
    const path = 'order/delete';
    const accessToken = store.getState().user.accessToken;

    const payload = data;

    try {
        const result = await authorizationRequest.deleteApi(path, payload, accessToken);
        return result;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
};
