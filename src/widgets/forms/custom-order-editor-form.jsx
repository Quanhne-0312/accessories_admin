import { CustomCurrencyDisplay } from '@/widgets/partials';
import { Avatar, Input, Textarea, Typography } from '@material-tailwind/react';
import PropTypes from 'prop-types';

export function CustomOrderEditorForm({ data, statuses, paymentMethods, onChange }) {
    const shippingAddress = data.shipping_address || {};
    const items = data.items || [];
    const selectedStatusId = String(data.status_id || data.status?.id || '');
    const selectedPaymentMethodId = String(data.payment_method_id || data.payment_method?.id || '');

    const handleChangeShippingAddress = (key, value) => {
        onChange('shipping_address', {
            ...shippingAddress,
            [key]: value,
        });
    };

    return (
        <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Input label="Mã đơn" value={data.order_uuid || ''} readOnly />
                <Input label="SĐT đặt hàng" value={data.customer_phone_number || ''} readOnly />
                <div className="rounded border border-blue-gray-100 px-3 py-2">
                    <Typography className="text-xs text-blue-gray-400">Thành tiền</Typography>
                    <CustomCurrencyDisplay
                        value={data.total}
                        className="text-sm font-semibold text-red-500"
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="relative block">
                    <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-xs text-blue-gray-400">
                        Trạng thái
                    </span>
                    <select
                        className="h-10 w-full rounded-[7px] border border-blue-gray-200 bg-white px-3 text-sm font-normal text-blue-gray-700 outline-none transition-all focus:border-2 focus:border-blue-500"
                        value={selectedStatusId}
                        onChange={(event) => onChange('status_id', Number(event.target.value))}
                    >
                        <option value="" disabled>
                            Chọn trạng thái
                        </option>
                        {statuses.map((status) => (
                            <option key={status.id} value={String(status.id)}>
                                {status.code} - {status.description}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="relative block">
                    <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-xs text-blue-gray-400">
                        Hình thức thanh toán
                    </span>
                    <select
                        className="h-10 w-full rounded-[7px] border border-blue-gray-200 bg-white px-3 text-sm font-normal text-blue-gray-700 outline-none transition-all focus:border-2 focus:border-blue-500"
                        value={selectedPaymentMethodId}
                        onChange={(event) => onChange('payment_method_id', Number(event.target.value))}
                    >
                        <option value="" disabled>
                            Chọn hình thức thanh toán
                        </option>
                        {paymentMethods.map((method) => (
                            <option key={method.id} value={String(method.id)}>
                                {method.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Input
                    label="Tên người nhận"
                    value={shippingAddress.receiver_name || ''}
                    onChange={(event) =>
                        handleChangeShippingAddress('receiver_name', event.target.value)
                    }
                />
                <Input
                    label="SĐT người nhận"
                    value={shippingAddress.receiver_phone || ''}
                    onChange={(event) =>
                        handleChangeShippingAddress('receiver_phone', event.target.value)
                    }
                />
                <Input
                    label="Địa chỉ nhận hàng"
                    value={shippingAddress.receiver_address || ''}
                    onChange={(event) =>
                        handleChangeShippingAddress('receiver_address', event.target.value)
                    }
                />
            </div>

            <Textarea
                label="Ghi chú"
                value={data.note || ''}
                onChange={(event) => onChange('note', event.target.value)}
            />

            <div className="grid gap-3">
                <Typography className="text-sm font-semibold text-blue-gray-700">
                    Sản phẩm trong đơn
                </Typography>
                {items.map((item) => (
                    <div
                        key={`${item.slug}-${item.product_id || item.id}`}
                        className="grid items-center gap-3 rounded border border-blue-gray-100 p-3 md:grid-cols-[auto_1fr_auto_auto]"
                    >
                        <Avatar
                            src={item.feature_image_url || '/img/default-avatar.jpg'}
                            alt={item.name || 'product'}
                            variant="rounded"
                            size="lg"
                        />
                        <div>
                            <Typography className="font-medium">{item.name || ''}</Typography>
                            <Typography className="text-xs text-blue-gray-400">
                                {item.slug || ''}
                            </Typography>
                        </div>
                        <Typography className="text-sm font-medium">x{item.quantity || 0}</Typography>
                        <CustomCurrencyDisplay
                            value={item.price}
                            className="text-sm font-semibold text-red-500"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

CustomOrderEditorForm.defaultProps = {
    data: {},
    statuses: [],
    paymentMethods: [],
};

CustomOrderEditorForm.propTypes = {
    data: PropTypes.object,
    statuses: PropTypes.array,
    paymentMethods: PropTypes.array,
    onChange: PropTypes.func.isRequired,
};

export default CustomOrderEditorForm;
