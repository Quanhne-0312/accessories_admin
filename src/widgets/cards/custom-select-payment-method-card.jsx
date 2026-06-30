import { orderService } from '@/services';
import { Accordion, AccordionBody, AccordionHeader, Radio, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

function CustomSelectPaymentMethodCard({ onChangePaymentMethod }) {
    const [open, setOpen] = useState(1);
    const [paymentMethods, setPaymentMethods] = useState(null);

    const handleOpen = (value) => setOpen(value);

    useEffect(() => {
        const handleGetPaymentMethods = async () => {
            const response = await orderService.getPaymentMethodsService();
            if (response && response.code === 'SUCCESS') {
                setPaymentMethods(response.result);
            }
        };
        handleGetPaymentMethods();
    }, []);

    useEffect(() => {
        if(paymentMethods){
            const method = paymentMethods.find(item => item.id === open)
            onChangePaymentMethod(method)
        }
    }, [open, paymentMethods]);

    return (
        <div className="grid gap-4 p-0">
            <Typography as="h3" className="text-xl font-semibold">
                Thanh toán
            </Typography>

            <Typography className="text-xs">Toàn bộ các giao dịch được bảo mật và mã hóa</Typography>

            <div className="border-t border-blue-gray-100">
                {paymentMethods &&
                    paymentMethods.map((item) => (
                        <Accordion
                            key={item.id}
                            open={open === item.id}
                            icon={
                                <div className="relative translate-x-3">
                                    <Radio
                                        color="blue"
                                        className="h-4 w-4"
                                        readOnly
                                        checked={open === item.id}
                                        icon={<Icon />}
                                    />
                                </div>
                            }
                            className={`select-none border border-blue-gray-100 border-t-transparent px-4 ${
                                open === item.id ? 'bg-blue-50/50' : null
                            }`}
                        >
                            <AccordionHeader
                                onClick={() => {
                                    handleOpen(item.id);
                                    // onChangePaymentMethod(item);
                                }}
                                className={`border-b-0 text-sm font-semibold transition-none ${
                                    open === item.id ? 'text-blue-500' : null
                                }`}
                            >
                                {item.name}
                            </AccordionHeader>
                            <AccordionBody className="pt-0 text-sm font-normal">{item.description}</AccordionBody>
                        </Accordion>
                    ))}
            </div>
        </div>
    );
}

export default CustomSelectPaymentMethodCard;

function Icon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-full w-full scale-105"
        >
            <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
            />
        </svg>
    );
}
