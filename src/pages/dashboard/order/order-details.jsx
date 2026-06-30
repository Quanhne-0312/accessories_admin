import { orderService } from '@/services';
import { CustomConfirmDialog, CustomCrudGroupButtons, CustomCurrencyDisplay } from '@/widgets/partials';
import { Avatar, Card, CardBody, CardFooter, Chip, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function OrderDetails() {
    const [orderData, setOrderData] = useState({});
    const [dialog, setDialog] = useState({
        title: 'Xóa đơn hàng',
        text: 'Xác nhận xóa đơn hàng?',
    });
    const { orderuuid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const handleGetOrder = async () => {
            const response = await orderService.getOrderByUuidService(orderuuid);
            if (response?.code === 'SUCCESS') {
                setOrderData(response.result);
            }
        };

        if (orderuuid) {
            handleGetOrder();
        }
    }, [orderuuid]);

    const handleCloseDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: false,
        }));
    };

    const handleRedirectToUpdate = () => {
        navigate(`/dashboard/order/update/${orderuuid}`);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleRedirectToManagerPage = () => {
        navigate('/dashboard/order');
    };

    const handleOpenDeleteDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: true,
            status: 'WARNING',
            btnCancel: 'Hủy',
            btnDelete: 'Xóa',
            handler: handleCloseDialog,
            onCancel: handleCloseDialog,
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
            order_uuid: orderuuid,
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
                text: response?.message || 'Xóa đơn hàng không thành công!',
            }));
        }
    };

    const items = orderData.items || [];
    const shippingAddress = orderData.shipping_address || {};

    return (
        <div className="my-10 flex flex-col gap-12">
            <Typography variant="h4">Chi tiết đơn hàng</Typography>

            <Card>
                <CardBody className="grid gap-6 p-4">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="rounded border border-blue-gray-100 p-3">
                            <Typography className="text-xs text-blue-gray-400">Mã đơn</Typography>
                            <Typography className="font-semibold">{orderData.order_uuid || ''}</Typography>
                        </div>
                        <div className="rounded border border-blue-gray-100 p-3">
                            <Typography className="text-xs text-blue-gray-400">SĐT đặt hàng</Typography>
                            <Typography className="font-semibold">
                                {orderData.customer_phone_number || ''}
                            </Typography>
                        </div>
                        <div className="rounded border border-blue-gray-100 p-3">
                            <Typography className="text-xs text-blue-gray-400">Trạng thái</Typography>
                            {orderData.status && (
                                <Chip
                                    value={orderData.status.code}
                                    color="blue"
                                    className="mt-1 w-max py-px text-xs"
                                />
                            )}
                        </div>
                        <div className="rounded border border-blue-gray-100 p-3">
                            <Typography className="text-xs text-blue-gray-400">Thành tiền</Typography>
                            <CustomCurrencyDisplay
                                value={orderData.total}
                                className="text-sm font-semibold text-red-500"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded border border-blue-gray-100 p-3">
                            <Typography className="mb-2 font-semibold">Thông tin nhận hàng</Typography>
                            <Typography className="text-sm">
                                Người nhận: {shippingAddress.receiver_name || ''}
                            </Typography>
                            <Typography className="text-sm">
                                SĐT: {shippingAddress.receiver_phone || ''}
                            </Typography>
                            <Typography className="text-sm">
                                Địa chỉ: {shippingAddress.receiver_address || ''}
                            </Typography>
                        </div>
                        <div className="rounded border border-blue-gray-100 p-3">
                            <Typography className="mb-2 font-semibold">Thanh toán và ghi chú</Typography>
                            <Typography className="text-sm">
                                Hình thức: {orderData.payment_method?.name || ''}
                            </Typography>
                            <Typography className="text-sm">Ghi chú: {orderData.note || ''}</Typography>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <Typography className="font-semibold">Sản phẩm</Typography>
                        {items.map((item) => (
                            <div
                                key={`${item.slug}-${item.product_id || item.id}`}
                                className="grid items-center gap-3 rounded border border-blue-gray-100 p-3 md:grid-cols-[auto_1fr_auto_auto]"
                            >
                                <Avatar
                                    src={item.feature_image_url || '/img/default-avatar.jpg'}
                                    alt={item.name}
                                    variant="rounded"
                                    size="lg"
                                />
                                <div>
                                    <Typography className="font-medium">{item.name}</Typography>
                                    <Typography className="text-xs text-blue-gray-400">
                                        {item.slug}
                                    </Typography>
                                </div>
                                <Typography className="text-sm font-medium">x{item.quantity}</Typography>
                                <CustomCurrencyDisplay
                                    value={item.price}
                                    className="text-sm font-semibold text-red-500"
                                />
                            </div>
                        ))}
                    </div>
                </CardBody>
                <CardFooter className="p-4">
                    <CustomCrudGroupButtons
                        btnConfirn={{
                            text: 'Chỉnh sửa',
                            onClick: handleRedirectToUpdate,
                        }}
                        btnDelete={{
                            text: 'Xóa đơn hàng',
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

export default OrderDetails;
