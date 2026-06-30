import CustomOrderProductCard from '@/components/cards/CustomOrderProductCard';
import CustomVoucherSubmitForm from '@/components/layouts/CustomVoucherSubmitForm';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import CustomCurrencyDisplay from '../shared/CustomCurrencyDisplay';

function CustomPaymentDetailsCard({ data }) {
    const cart = useSelector((state) => state.cart);

    const PaymentRow = ({ title, value, isTotal }) => (
        <div className="flex items-baseline justify-between gap-4">
            <Typography className="text-sm font-medium text-gray-600 line-clamp-1">{title}:</Typography>
            <CustomCurrencyDisplay
                className={`text-base font-semibold ${isTotal ? 'text-red-600' : null}`}
                value={value}
            />
        </div>
    );

    return (
        <div className="grid gap-4">
            <Typography as="h3" className="text-xl font-semibold">
                Tổng quan đơn hàng
            </Typography>

            <div className="grid gap-2">
                {cart.items.length > 0 ? cart.items.map((item) => (
                    <CustomOrderProductCard key={item.id ?? item.slug} data={item} />
                )) : (
                    <div className='select-none p-4 text-center border border-blue-gray-200 rounded-lg bg-white font-medium'>
                        Không có sản phẩm trong giỏ
                    </div>
                )}
            </div>

            <CustomVoucherSubmitForm />

            <div className="grid gap-2">
                <PaymentRow title={'Tổng tiền sản phẩm'} value={data.subtotal} />
                <PaymentRow title={'Phí vận chuyển'} value={data.shipping_fee} />
                <PaymentRow title={'Mã giảm giá'} value={data.discount} />
                <hr className="border-t border-blue-gray-100"></hr>
                <PaymentRow title={'Thành tiền'} value={data.total} isTotal />
            </div>
        </div>
    );
}

export default CustomPaymentDetailsCard;
