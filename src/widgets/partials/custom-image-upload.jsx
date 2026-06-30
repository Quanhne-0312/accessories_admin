import { imageService } from '@/services';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { IconButton, Typography } from '@material-tailwind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function CustomImageUpload({ slug, images, feature, onChangeImages, onChangeFeature }) {
    const handleRemoveImage = async (img) => {
        const updatedImages = images.filter((item) =>
            img.isFallback ? item.secure_url !== img.secure_url : item.public_id !== img.public_id,
        );
        if (updatedImages.length < images.length) {
            const result =
                img.isFallback || !img.public_id || img.public_id.startsWith('seed-products/') || img.secure_url?.startsWith('data:')
                    ? true
                    : await handleCloudinaryRollback(img.public_id);
            if (result) {
                toast.info(`Đã xóa ảnh [${img.public_id || img.secure_url}]`);
                onChangeImages(updatedImages);
            }
            if (feature === img.secure_url) {
                onChangeFeature(updatedImages.length > 0 ? updatedImages[0].secure_url : null);
            }
        }
    };

    const handleSelectFeature = (img) => {
        onChangeFeature(img.secure_url);
    };

    const handleCloudinaryRollback = async (public_id) => {
        const destroyImages = [{ public_id }];
        const response = await imageService.rollbackCloudUpload(destroyImages);

        if (response && response.code === 'SUCCESS') {
            return true;
        }
        return false;
    };

    const handleCloudinaryUpload = () => {
        if (images && images.length >= 12) {
            toast.info('Tối đa 12 ảnh. Xóa trước khi thêm mới!');
            return;
        }

        window.cloudinary.openUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_ORIGIN_PRESET,
                clientAllowedFormats: ['image'],
                maxImageFileSize: 5000000,
            },
            (error, result) => {
                if (!error && result && result.event === 'queues-end') {
                    const uploadImages = result.info.files.map((item) => {
                        const { original_filename, public_id, secure_url, thumbnail_url } = item.uploadInfo;
                        return { original_filename, public_id, secure_url, thumbnail_url };
                    });
                    const updatedImages = images ? [...images, ...uploadImages] : uploadImages;
                    onChangeImages(updatedImages);

                    if (!feature) {
                        onChangeFeature(updatedImages[0].secure_url);
                    }
                }
            },
        );
    };

    const Image = ({ src, alt, isFeature, onDelete, onSelectFeature }) => (
        <div className="relative w-full select-none overflow-hidden rounded-lg pt-[100%] shadow">
            <div
                className={`absolute inset-0 overflow-hidden ${
                    isFeature ? 'border-4 border-blue-500 bg-blue-500' : 'border-none bg-gray-200'
                }`}
                onClick={onSelectFeature}
            >
                <img src={src} alt={alt} className="h-full w-full rounded-md object-cover object-center" />
            </div>
            <div className="absolute top-1.5 right-1.5">
                <IconButton
                    color="white"
                    variant="gradient"
                    className=" h-6 w-6 rounded-full border border-transparent transition-all hover:rotate-180 hover:border-gray-500 hover:shadow-all"
                    onClick={onDelete}
                >
                    <XMarkIcon className="h-5 w-5" />
                </IconButton>
            </div>
        </div>
    );

    return (
        <>
            <div className="flex flex-col gap-4">
                {images && !_.isEmpty(images) && (
                    <ul className="grid h-full w-full grid-cols-2 gap-3 transition-all duration-300 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {images.map((img, index) => (
                            <li key={index} className="">
                                <Image
                                    src={img.secure_url}
                                    alt={img.public_id}
                                    isFeature={feature === img.secure_url}
                                    onDelete={() => handleRemoveImage(img)}
                                    onSelectFeature={() => handleSelectFeature(img)}
                                />
                            </li>
                        ))}
                    </ul>
                )}

                <label className="grid w-full cursor-pointer select-none place-items-center rounded-lg border border-dashed border-blue-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-100/20">
                    <div
                        onClick={handleCloudinaryUpload}
                        className="flex flex-col items-center justify-center py-6 text-gray-500"
                    >
                        <Typography className="mb-2 text-sm font-semibold">{'Tải ảnh lên (Tối đa 12 ảnh)'}</Typography>
                        <Typography className="text-xs font-normal">{'SVG, PNG, JPG or GIF (MAX. 5Mb)'}</Typography>
                    </div>
                </label>
            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={true}
                closeOnClick={false}
                newestOnTop={false}
                closeButton={false}
                pauseOnFocusLoss
                pauseOnHover
                theme="light"
                draggable
                rtl={false}
            />
        </>
    );
}

CustomImageUpload.propTypes = {
    images: PropTypes.array,
    onChangeImages: PropTypes.func,
};

export default memo(CustomImageUpload);
