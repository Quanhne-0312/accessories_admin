import { updateProfile } from '@/redux/actions/userAction';
import { authService } from '@/services';
import { CustomUserEditorForm } from '@/widgets/forms';
import { CustomConfirmDialog, CustomCrudGroupButtons } from '@/widgets/partials';
import { Card, CardBody, CardFooter } from '@material-tailwind/react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function ProfileUpdate() {
    const [profile, setProfile] = useState({});
    const [defaultProfile, setDefaultProfile] = useState({});
    const [updatable, setUpdatable] = useState(false);
    const [dialog, setDialog] = useState({});
    const user = useSelector((state) => state.user.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const birth = handleFormatDate(user?.birth);
            const address = handleConvertAddressToObject(user?.address);

            setProfile({
                ...user,
                birth,
                address,
                password: '',
            });

            setDefaultProfile({
                ...user,
                birth,
                address,
                password: '',
            });
        }

        return () => {
            setProfile({});
            setDefaultProfile({});
        };
    }, [user]);

    useEffect(() => {
        if (_.isEqual(defaultProfile, profile)) {
            setUpdatable(false);
        } else {
            setUpdatable(true);
        }

        return () => setUpdatable(false);
    }, [defaultProfile, profile]);

    const handleFormatDate = (date) => {
        if (!date) {
            return '';
        }

        const localeDate = new Date(date);
        const day = localeDate.getDate().toString().padStart(2, '0');
        const month = (localeDate.getMonth() + 1).toString().padStart(2, '0');
        const year = localeDate.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const handleConvertAddressToObject = (address) => {
        if (!address || typeof address !== 'string') {
            return {};
        }

        const slicedAddress = address.split('-').filter((item) => item !== '');

        const province = slicedAddress.pop()?.trim() || '';
        const district = slicedAddress.pop()?.trim() || '';
        const ward = slicedAddress.pop()?.trim() || '';
        const location = slicedAddress.join('-').trim();
        return { location, ward, district, province };
    };

    const handleConvertAddressToString = (address) => {
        const values = [address?.location, address?.ward, address?.district, address?.province];
        return values.filter(Boolean).join(' - ');
    };

    const handleOnChangeInput = (key, value) => {
        setProfile((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleUpdateProfile = async (data) => {
        try {
            setDialog((prevState) => ({
                ...prevState,
                status: 'PENDING',
                text: 'Đang xử lý thông tin...',
            }));

            const response = await new Promise((resolve) => {
                setTimeout(async () => {
                    const result = await authService.updateProfileService(data);
                    resolve(result);
                }, 2000);
            });

            if (response && response.code === 'SUCCESS') {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'SUCCESS',
                    text: `Cập nhật thông tin thành công!`,
                }));

                let countdown = 50;
                const countdownInterval = setInterval(() => {
                    setDialog((prevState) => ({
                        ...prevState,
                        countdown: countdown / 10,
                    }));
                    countdown = countdown - 1;
                    if (countdown === 0) {
                        clearInterval(countdownInterval);
                        const address = handleConvertAddressToString(data.address);
                        const profileData = { ...data, address };
                        delete profileData.password;
                        dispatch(updateProfile(profileData));
                        navigate(-1);
                    }
                }, 100);
            } else {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'ERROR',
                    btnConfirm: 'Thử lại',
                    text: response?.message || 'Cập nhật thông tin không thành công!',
                }));
            }
        } catch (error) {
            setDialog((prevState) => ({
                ...prevState,
                status: 'ERROR',
                btnConfirm: 'Thử lại',
                text: error?.message || error || 'Cập nhật thông tin không thành công!',
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateProfile(profile);
    };

    /** 3. Active dialog */

    const handleOpenUpdateDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: true,
            status: 'READY',
            title: 'Cập nhật thông tin tài khoản',
            text: 'Xác nhận cập nhật thông tin tài khoản?',
            handler: handleCloseDialog,
            btnCancel: 'Hủy',
            onCancel: handleCloseDialog,
            btnConfirm: 'Cập nhật',
            onConfirm: handleSubmit,
        }));
    };

    const handleCloseDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: false,
        }));
    };

    const handleCancel = async () => {
        navigate(-1);
    };

    return (
        <>
            <div className="relative -mx-4 mt-8 h-72 overflow-hidden bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
                <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
            </div>
            <Card className="-mt-16 mb-6 border-b border-blue-gray-100">
                <CardBody className="p-4">
                    {!_.isEmpty(profile) && (
                        <CustomUserEditorForm data={profile} onChange={handleOnChangeInput} />
                    )}
                </CardBody>
                <CardFooter>
                    <CustomCrudGroupButtons
                        btnConfirn={{
                            text: 'Lưu lại',
                            disabled: !updatable,
                            onClick: handleOpenUpdateDialog,
                        }}
                        btnCancel={{
                            text: 'Hủy',
                            onClick: handleCancel,
                        }}
                    />
                </CardFooter>
            </Card>
            <CustomConfirmDialog {...dialog} />
        </>
    );
}

export default ProfileUpdate;
