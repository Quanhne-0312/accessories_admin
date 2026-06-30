import { userService } from '@/services';
import { ProfileInfoCard } from '@/widgets/cards';
import { CustomConfirmDialog, CustomCrudGroupButtons } from '@/widgets/partials';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { Avatar, Card, CardBody, CardFooter, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function UserDetails() {
    const [isLoading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [dialog, setDialog] = useState({
        title: 'Xóa tài khoản',
        text: 'Xác nhận xóa tài khoản?',
    });
    const { username } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const handleGetUserByUsername = async (username) => {
            setLoading(true);
            let response = await userService.getUserByUsernameService(username);
            if (response && response.code === 'SUCCESS') {
                response.result.birth = handleFormatDate(response.result.birth);
                setUserData(response.result);
            }
            setLoading(false);
        };

        handleGetUserByUsername(username);
    }, []);

    const handleFormatDate = (date) => {
        const localeDate = new Date(date);
        const day = localeDate.getDate().toString().padStart(2, '0');
        const month = (localeDate.getMonth() + 1).toString().padStart(2, '0');
        const year = localeDate.getFullYear();
        return `${year}-${month}-${day}`;
    };

    /** DATA SUBMIT HANDLER */

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
                }, 2000);
            });

            if (response && response.code === 'SUCCESS') {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'SUCCESS',
                    text: `Đã xóa tài khoản "${data.phone_number}".`,
                    icon: <CheckCircleIcon className="h-8 w-8 text-green-600" />,
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
                    status: 'FAILURE',
                    text: 'Xóa tài khoản không thành công!',
                    icon: <ExclamationCircleIcon className="h-8 w-8 text-red-500" />,
                }));
            }
        } catch (error) {
            setDialog((prevState) => ({
                ...prevState,
                status: 'FAILURE',
                text: error?.message || error || 'Xóa tài khoản không thành công!',
                icon: <ExclamationCircleIcon className="h-8 w-8 text-red-500" />,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleDeleteUser(userData);
    };

    const handleCloseDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: false,
        }));
    };

    const handleOpenDeleteDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: true,
            btnCancel: 'Hủy',
            btnConfirm: 'Xác nhận',
            handler: handleCloseDialog,
            onCancel: handleCloseDialog,
            onConfirm: handleSubmit,
        }));
    };

    const handleRedirectToUpdate = () => {
        navigate(`/dashboard/user/update/${username}`);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="my-10 flex flex-col gap-12">
            <Typography variant="h4">Thông tin tài khoản</Typography>

            <Card>
                <CardBody className="grid gap-6 p-4">
                    <div className="flex flex-wrap items-center justify-center gap-6 md:flex-nowrap">
                        <div className="group relative shrink-0 overflow-hidden rounded-full">
                            <Avatar
                                src={userData?.avatar?.secure_url ?? '/img/default-avatar.jpg'}
                                alt="bruce-mars"
                                withBorder={true}
                                color="green"
                                className="h-60 w-60 p-0.5 shadow-lg shadow-blue-gray-500/40"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <Typography variant="h5" className="font-semibold">
                                {userData.name ?? ''}
                            </Typography>
                            <Typography variant="small" className="font-normal">
                                {userData.role ?? ''}
                            </Typography>
                        </div>
                    </div>

                    <ProfileInfoCard data={userData} />
                </CardBody>
                <CardFooter className="p-4">
                    <CustomCrudGroupButtons
                        btnConfirn={{
                            text: 'Chỉnh sửa',
                            onClick: handleRedirectToUpdate,
                        }}
                        btnDelete={{
                            text: 'Xóa tài khoản',
                            onClick: handleOpenDeleteDialog,
                        }}
                        btnCancel={{
                            text: 'Trở về',
                            onClick: handleCancel,
                        }}
                    />
                </CardFooter>
            </Card>

            <CustomConfirmDialog {...dialog} />
        </div>
    );
}

export default UserDetails;
