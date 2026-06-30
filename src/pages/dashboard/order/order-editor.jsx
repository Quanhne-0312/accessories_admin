import { orderService } from '@/services';
import { CustomOrderEditorForm } from '@/widgets/forms';
import { CustomConfirmDialog, CustomCrudGroupButtons } from '@/widgets/partials';
import { Card, CardBody, CardFooter, Typography } from '@material-tailwind/react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function OrderEditor() {
    const [orderData, setOrderData] = useState({});
    const [defaultData, setDefaultData] = useState({});
    const [statuses, setStatuses] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [updatable, setUpdatable] = useState(false);
    const [dialog, setDialog] = useState({
        title: 'Cập nhật đơn hàng',
        text: 'Xác nhận cập nhật đơn hàng?',
    });
    const navigate = useNavigate();
    const { orderuuid } = useParams();

    useEffect(() => {
        const handleGetOptions = async () => {
            const [statusResponse, paymentResponse] = await Promise.all([
                orderService.getOrderStatusesService(),
                orderService.getPaymentMethodsService(),
            ]);

            if (statusResponse?.code === 'SUCCESS') {
                setStatuses(statusResponse.result);
            }

            if (paymentResponse?.code === 'SUCCESS') {
                setPaymentMethods(paymentResponse.result);
            }
        };

        handleGetOptions();
    }, []);

    useEffect(() => {
        const handleGetOrder = async () => {
            const response = await orderService.getOrderByUuidService(orderuuid);
            if (response?.code === 'SUCCESS') {
                const result = {
                    ...response.result,
                    status_id: response.result.status?.id,
                    payment_method_id: response.result.payment_method?.id,
                };

                setDefaultData(result);
                setOrderData(result);
            }
        };

        if (orderuuid) {
            handleGetOrder();
        }
    }, [orderuuid]);

    useEffect(() => {
        setUpdatable(!_.isEqual(orderData, defaultData));
    }, [defaultData, orderData]);

    const handleOnChangeInput = (key, value) => {
        setOrderData((prevState) => ({
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

    const handleCancel = () => {
        navigate(-1);
    };

    const handleRedirectToManagerPage = () => {
        navigate('/dashboard/order');
    };

    const handleOpenUpdateDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: true,
            status: 'READY',
            title: 'Cập nhật đơn hàng',
            text: 'Xác nhận cập nhật đơn hàng?',
            handler: handleCloseDialog,
            btnCancel: 'Hủy',
            onCancel: handleCloseDialog,
            btnConfirm: 'Cập nhật',
            onConfirm: handleSubmitUpdateOrder,
        }));
    };

    const handleSubmitUpdateOrder = async () => {
        setDialog((prevState) => ({
            ...prevState,
            status: 'PENDING',
            text: 'Đang xử lý thông tin...',
        }));

        const response = await orderService.updateOrderService({
            order_uuid: orderData.order_uuid,
            status_id: orderData.status_id,
            payment_method_id: orderData.payment_method_id,
            note: orderData.note,
            shipping_address: orderData.shipping_address,
        });

        if (response?.code === 'SUCCESS') {
            setDialog((prevState) => ({
                ...prevState,
                status: 'SUCCESS',
                text: 'Cập nhật đơn hàng thành công!',
                btnConfirm: 'Về danh sách',
                onConfirm: handleRedirectToManagerPage,
            }));
        } else {
            setDialog((prevState) => ({
                ...prevState,
                status: 'ERROR',
                btnConfirm: 'Thử lại',
                text: response?.message || 'Cập nhật đơn hàng không thành công!',
            }));
        }
    };

    const handleOpenDeleteDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: true,
            status: 'WARNING',
            title: 'Xóa đơn hàng',
            text: 'Xác nhận xóa đơn hàng này?',
            handler: handleCloseDialog,
            btnCancel: 'Hủy',
            onCancel: handleCloseDialog,
            btnDelete: 'Xóa',
            onDelete: handleSubmitDeleteOrder,
        }));
    };

    const handleSubmitDeleteOrder = async () => {
        setDialog((prevState) => ({
            ...prevState,
            status: 'PENDING',
            text: 'Đang xử lý thông tin...',
        }));

        const response = await orderService.deleteOrderService({
            order_uuid: orderData.order_uuid,
        });

        if (response?.code === 'SUCCESS') {
            setDialog((prevState) => ({
                ...prevState,
                status: 'SUCCESS',
                text: 'Xóa đơn hàng thành công!',
                btnConfirm: 'Về danh sách',
                onConfirm: handleRedirectToManagerPage,
            }));
        } else {
            setDialog((prevState) => ({
                ...prevState,
                status: 'ERROR',
                btnDelete: 'Thử lại',
                text: response?.message || 'Xóa đơn hàng không thành công!',
            }));
        }
    };

    return (
        <div className="my-10 flex flex-col gap-12">
            <Typography variant="h4">
                {orderuuid ? 'Cập nhật thông tin đơn hàng' : 'Tạo đơn hàng mới'}
            </Typography>
            <Card>
                <CardBody className="p-4">
                    {orderuuid ? (
                        <CustomOrderEditorForm
                            data={orderData}
                            statuses={statuses}
                            paymentMethods={paymentMethods}
                            onChange={handleOnChangeInput}
                        />
                    ) : (
                        <Typography className="text-sm text-blue-gray-500">
                            Vui lòng tạo đơn hàng từ trang cửa hàng để có đủ sản phẩm và thông tin thanh toán.
                        </Typography>
                    )}
                </CardBody>

                <CardFooter className="p-4">
                    <CustomCrudGroupButtons
                        btnConfirn={{
                            text: 'Cập nhật',
                            disabled: !orderuuid || !updatable,
                            onClick: handleOpenUpdateDialog,
                        }}
                        btnDelete={{
                            text: 'Xóa',
                            disabled: !orderuuid,
                            onClick: handleOpenDeleteDialog,
                        }}
                        btnCancel={{
                            text: 'Hủy',
                            onClick: handleCancel,
                        }}
                    />
                </CardFooter>
            </Card>
            <CustomConfirmDialog {...dialog} />
        </div>
    );
}

export default OrderEditor;
