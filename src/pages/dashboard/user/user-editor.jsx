import { userService } from '@/services';
import { CustomUserEditorForm } from '@/widgets/forms';
import { CustomConfirmDialog, CustomCrudGroupButtons } from '@/widgets/partials';
import { Card, CardBody, CardFooter, Typography } from '@material-tailwind/react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function UserEditor() {
    const [isLoading, setLoading] = useState(false);
    const [updatable, setUpdatable] = useState(false);
    const [userData, setUserData] = useState({ address: {} });
    const [defaultData, setDefaultData] = useState({ address: {} });
    const [dialog, setDialog] = useState({
        title: 'Cập nhật thông tin tài khoản',
        text: 'Xác nhận cập nhật thông tin tài khoản?',
    });
    const navigate = useNavigate();
    const { username } = useParams();

    useEffect(() => {
        const handleGetUserByUsername = async (username) => {
            setLoading(true);
            const response = await userService.getUserByUsernameService(username);
            if (response && response.code === 'SUCCESS') {
                const birth = handleFormatDate(response.result.birth);
                const address = handleConvertAddress(response.result.address);
                setDefaultData({
                    ...response.result,
                    birth,
                    address,
                    password: '',
                    current_password_display: '********',
                    new_password: '',
                    confirm_new_password: '',
                });
                setUserData({
                    ...response.result,
                    birth,
                    address,
                    password: '',
                    current_password_display: '********',
                    new_password: '',
                    confirm_new_password: '',
                });
            }
            setLoading(false);
        };

        if (username) {
            handleGetUserByUsername(username);
        }
    }, [username]);

    useEffect(() => {
        if (_.isEqual(userData, defaultData)) {
            setUpdatable(false);
        } else {
            setUpdatable(true);
        }

        return () => setUpdatable(false);
    }, [userData]);

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

    const handleConvertAddress = (address) => {
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

    /** EVENT HANDLER */

    const handleOnChangeInput = (key, value) => {
        setUserData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleCloseDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: false,
        }));
    };

    const handleRedirectToManagerPage = () => {
        navigate('/dashboard/user');
    };

    const handleCancel = async () => {
        navigate(-1);
    };

    const handleResetData = () => {
        setUserData({ address: {} });
    };

    /** 1: Create User */
    const handleOpenCreateDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: true,
            status: 'READY',
            title: 'Tạo mới tài khoản',
            text: 'Xác nhận tạo mới tài khoản?',
            handler: handleCloseDialog,
            btnCancel: 'Hủy',
            onCancel: handleCloseDialog,
            btnConfirm: 'Tạo mới',
            onConfirm: handleSubmitCreateUser,
        }));
    };
    const handleSubmitCreateUser = (e) => {
        e.preventDefault();
        handleCreateUser(userData);
    };
    const handleCreateUser = async (data) => {
        try {
            if (data.password !== data.confirm_password) {
                setDialog((prevState) => ({
                    ...prevState,
                    open: true,
                    status: 'ERROR',
                    btnConfirm: 'Thử lại',
                    text: 'Mật khẩu nhập lại không khớp.',
                }));
                return;
            }

            setDialog((prevState) => ({
                ...prevState,
                status: 'PENDING',
                text: 'Đang xử lý thông tin...',
            }));

            const response = await new Promise((resolve) => {
                setTimeout(async () => {
                    const result = await userService.createUserService(data);
                    resolve(result);
                }, 1000);
            });

            if (response && response.code === 'SUCCESS') {
                handleResetData();

                setDialog((prevState) => ({
                    ...prevState,
                    status: 'SUCCESS',
                    text: `Tạo mới tài khoản thành công!`,
                    btnCancel: 'Tạo thêm tài khoản',
                    btnConfirm: 'Đến trang quản lý',
                    onConfirm: handleRedirectToManagerPage,
                }));
            } else {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'ERROR',
                    text: 'Tạo mới tài khoản không thành công!',
                    btnConfirm: 'Thử lại',
                }));
            }
        } catch (error) {
            setDialog((prevState) => ({
                ...prevState,
                status: 'ERROR',
                btnConfirm: 'Thử lại',
                text: error?.message || error || 'Tạo mới tài khoản không thành công!',
            }));
        }
    };

    /** 2: Update User */
    const handleOpenUpdateDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: true,
            status: 'READY',
            title: 'Cập nhật tài khoản',
            text: 'Xác nhận cập nhật tài khoản?',
            handler: handleCloseDialog,
            btnCancel: 'Hủy',
            onCancel: handleCloseDialog,
            btnConfirm: 'Cập nhật',
            onConfirm: handleSubmitUpdateUser,
        }));
    };
    const handleSubmitUpdateUser = (e) => {
        e.preventDefault();
        handleUpdateUser(userData);
    };
    const handleUpdateUser = async (data) => {
        try {
            const newPassword = data.new_password?.trim() || '';
            const confirmNewPassword = data.confirm_new_password?.trim() || '';

            if (newPassword || confirmNewPassword) {
                if (newPassword !== confirmNewPassword) {
                    setDialog((prevState) => ({
                        ...prevState,
                        open: true,
                        status: 'ERROR',
                        btnConfirm: 'Thử lại',
                        text: 'Mật khẩu mới nhập lại không khớp.',
                    }));
                    return;
                }
            }

            setDialog((prevState) => ({
                ...prevState,
                status: 'PENDING',
                text: 'Đang xử lý thông tin...',
            }));

            const response = await new Promise((resolve) => {
                setTimeout(async () => {
                    const payload = {
                        ...data,
                        password: newPassword,
                    };
                    delete payload.current_password_display;
                    delete payload.new_password;
                    delete payload.confirm_new_password;
                    delete payload.confirm_password;

                    const result = await userService.updateUserService(payload);
                    resolve(result);
                }, 1000);
            });

            if (response && response.code === 'SUCCESS') {
                const loginPlace = Number(data.role_id) === 3 ? 'trang cửa hàng' : 'trang quản trị';
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'SUCCESS',
                    text: `Cập nhật thông tin thành công! Tài khoản này đăng nhập ở ${loginPlace}.`,
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

    /** 3: Delete User */
    const handleOpenDeleteDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: true,
            status: 'WARNING',
            title: 'Xóa tài khoản',
            text: 'Xác nhận xóa tài khoản này?',
            handler: handleCloseDialog,
            btnCancel: 'Hủy',
            onCancel: handleCloseDialog,
            btnDelete: 'Xoá',
            onDelete: handleSubmitDeleteUser,
        }));
    };
    const handleSubmitDeleteUser = (e) => {
        e.preventDefault();
        handleDeleteUser(userData);
    };
    const handleDeleteUser = async (data) => {
        try {
            setDialog((prevState) => ({
                ...prevState,
                status: 'PENDING',
                text: 'Đang xử lý thông tin...',
            }));

            const response = await new Promise((resolve) => {
                setTimeout(async () => {
                    const result = await userService.deleteUserService(data);
                    resolve(result);
                }, 1000);
            });

            if (response && response.code === 'SUCCESS') {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'SUCCESS',
                    text: `Đã xóa "${data.name}".`,
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
                        handleRedirectToManagerPage();
                    }
                }, 100);
            } else {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'ERROR',
                    btnDelete: 'Thử lại',
                    text: 'Xóa tài khoản không thành công!',
                }));
            }
        } catch (error) {
            setDialog((prevState) => ({
                ...prevState,
                status: 'ERROR',
                btnDelete: 'Thử lại',
                text: error?.message || error || 'Xóa tài khoản không thành công!',
            }));
        }
    };

    return (
        <div className="my-10 flex flex-col gap-12">
            <Typography variant="h4">
                {username ? 'Cập nhật thông tin tài khoản' : 'Tạo tài khoản mới'}
            </Typography>
            <Card>
                <CardBody className="p-4">
                    {!_.isEmpty(userData) && (
                        <CustomUserEditorForm
                            data={userData}
                            isCreate={!username}
                            canEditRole
                            onChange={handleOnChangeInput}
                        />
                    )}
                </CardBody>

                <CardFooter className="p-4">
                    {username ? (
                        <CustomCrudGroupButtons
                            btnConfirn={{
                                text: 'Cập nhật',
                                disabled: !updatable,
                                onClick: handleOpenUpdateDialog,
                            }}
                            btnDelete={{
                                text: 'Xóa',
                                onClick: handleOpenDeleteDialog,
                            }}
                            btnCancel={{
                                text: 'Hủy',
                                onClick: handleCancel,
                            }}
                        />
                    ) : (
                        <CustomCrudGroupButtons
                            btnConfirn={{
                                text: 'Tạo mới',
                                disabled: !updatable,
                                onClick: handleOpenCreateDialog,
                            }}
                            btnCancel={{
                                text: 'Hủy',
                                onClick: handleCancel,
                            }}
                        />
                    )}
                </CardFooter>
            </Card>
            <CustomConfirmDialog {...dialog} />
        </div>
    );
}

// UserEditor.propTypes = {
//     data: PropTypes.object,
// };

export default UserEditor;
