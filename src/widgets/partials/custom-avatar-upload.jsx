import { imageService } from '@/services';
import { PencilIcon } from '@heroicons/react/24/solid';
import { Avatar, IconButton } from '@material-tailwind/react';
import PropTypes from 'prop-types';
import { memo } from 'react';

export function CustomAvatarUpload({ avatar, readOnly, onChangeAvatar }) {
    const handleCloudinaryRollback = async (public_id) => {
        const destroyImages = [{ public_id }];
        const response = await imageService.rollbackCloudUpload(destroyImages);

        if (response && response.code === 'SUCCESS') {
            return true;
        }
        return false;
    };

    const handleCloudinaryUpload = () => {
        window.cloudinary.openUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_CROP_PRESET,
                cropping: true,
                croppingAspectRatio: 1,
                croppingShowDimensions: true,
                croppingDefaultEnabled: true,
                croppingShowSkipCropButton: false,
                clientAllowedFormats: ['image'],
                maxImageFileSize: 5000000,
            },
            (error, result) => {
                if (!error && result && result.event === 'success') {
                    const { original_filename, public_id, secure_url, thumbnail_url } = result.info;
                    handleCloudinaryRollback(avatar?.public_id);
                    onChangeAvatar({ original_filename, public_id, secure_url, thumbnail_url });
                }
            },
        );
    };

    return (
        <div className="group relative overflow-hidden rounded-full">
            <Avatar
                src={avatar?.secure_url || '/img/default-avatar.jpg'}
                alt="bruce-mars"
                withBorder={true}
                color="green"
                className="h-60 w-60 p-0.5 shadow-lg shadow-blue-gray-500/40"
            />

            <div
                className={`absolute inset-x-0 top-1/2 bottom-0 grid translate-y-full place-items-center bg-gray-500/50 shadow-all transition-transform duration-300 ${
                    readOnly ? null : 'group-hover:translate-y-0'
                }`}
            >
                <IconButton variant="gradient" size="lg" onClick={handleCloudinaryUpload}>
                    <PencilIcon className="h-5 w-5" />
                </IconButton>
            </div>
        </div>
    );
}

CustomAvatarUpload.propTypes = {
    avatar: PropTypes.object,
    readOnly: PropTypes.bool,
    onChangeAvatar: PropTypes.func,
};

export default memo(CustomAvatarUpload);
