import * as request from '@/utils/authorization-request';
import store from '../redux/store';

export const rollbackCloudUpload = async (images) => {
    const path = 'image/rollback';

    const payload = {
        images,
    };

    try {
        const result = await request.postApi(path, payload);
        return result;
    } catch (error) {
        console.log(error);
    }
};
