import { CustomCrudMenu, CustomCurrencyDisplay } from '@/widgets/partials';
import CustomBagdeNotification from '@/widgets/partials/cutom-bagde-notification';
import { Avatar, Chip, IconButton, Typography } from '@material-tailwind/react';

function CustomOrderTable({ data, handlePreview, handleUpdate, handleDelete }) {
    const dataKeys = [
        {
            title: 'Mã đơn',
            key: 'order_uuid',
        },
        {
            title: 'Sdt đặt hàng',
            key: 'customer_phone_number',
        },
        {
            title: 'Thành tiền',
            key: 'total',
        },

        {
            title: 'Sản phẩm',
            key: 'items',
        },
        {
            title: 'Trạng thái',
            key: 'status',
        },
        {
            title: 'Địa chỉ nhận hàng',
            key: 'shipping_address',
        },
        {
            title: 'Hình thức thanh toán',
            key: 'payment_method',
        },
    ];

    const OrderStatus = ({ data }) => (
        <Chip
            variant="gradient"
            color={data.id === 1 ? 'blue' : 'blue-gray'}
            value={data.code}
            className="w-max py-px text-xs"
        />
    );

    const OrderDetails = ({ data }) => (
        <div className="flex min-w-max items-center gap-1.5">
            {data.slice(0, 3).map((el) => (
                <CustomBagdeNotification key={el.slug} notification={el.quantity}>
                    <Avatar
                        size="sm"
                        variant="rounded"
                        alt={el.slug}
                        src={el.feature_image_url ?? '/img/default-avatar.jpg'}
                    />
                </CustomBagdeNotification>
            ))}
            {data.length > 3 && <IconButton>{data.length - 3}+</IconButton>}
        </div>
    );

    const ShippingAddress = ({ data }) => (
        <Typography className="min-w-[240px] text-sm font-medium line-clamp-1">
            {data.receiver_address}
        </Typography>
    );

    const PaymentMethod = ({ data }) => (
        <Typography className="w-max text-sm font-medium line-clamp-1">
            {data.name}
        </Typography>
    );

    const classname = 'text-ellipsis border-t border-blue-gray-100 py-3 px-5';

    return (
        <table className="w-full min-w-[640px] table-auto">
            <thead>
                <tr>
                    {dataKeys.map((item) => (
                        <th
                            key={item.key}
                            className="text-ellipsis whitespace-nowrap border-t border-blue-gray-100 first:text-left"
                        >
                            <Typography className="py-3 px-5 text-xs font-bold uppercase">
                                {item.title}
                            </Typography>
                        </th>
                    ))}
                    <th className="border-t border-blue-gray-100"></th>
                </tr>
            </thead>
            <tbody>
                {data && data.length > 0 ? (
                    data.map((item, index) => (
                        <tr key={index}>
                            {dataKeys.map((col) => (
                                <td key={col.key} className={classname}>
                                    {col.key === 'status' ? (
                                        <OrderStatus data={item[col.key]} />
                                    ) : col.key === 'items' ? (
                                        <OrderDetails data={item[col.key]} />
                                    ) : col.key === 'total' ? (
                                        <CustomCurrencyDisplay
                                            className="float-right text-sm font-medium text-red-400"
                                            value={item[col.key]}
                                        />
                                    ) : col.key === 'shipping_address' ? (
                                        <ShippingAddress data={item[col.key]} />
                                    ) : col.key === 'payment_method' ? (
                                        <PaymentMethod data={item[col.key]} />
                                    ) : (
                                        <Typography
                                            className={`float-right whitespace-nowrap text-sm ${
                                                col.key === 'order_uuid'
                                                    ? 'font-semibold'
                                                    : 'font-normal text-gray-500'
                                            }`}
                                        >
                                            {item[col.key]}
                                        </Typography>
                                    )}
                                </td>
                            ))}
                            <td className="border-t border-blue-gray-100 py-3 pl-5 text-right">
                                <CustomCrudMenu
                                    onPreview={() => handlePreview(item.order_uuid)}
                                    onUpdate={() => handleUpdate(item.order_uuid)}
                                    onDelete={() => handleDelete(item.order_uuid)}
                                />
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={dataKeys.length + 1}
                            className="w-full text-ellipsis whitespace-nowrap border-t border-blue-gray-100 py-3 px-5"
                        >
                            Không có bản ghi dữ liệu người dùng nào
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default CustomOrderTable;
