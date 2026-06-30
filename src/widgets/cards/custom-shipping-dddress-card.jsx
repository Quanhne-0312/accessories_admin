import { MapPinIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/solid';
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Input,
    Radio,
    Typography
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import CustomAddressSelection from '../partials/custom-address-selection';

function CustomShippingAddressCard({defaultData, onChangeAddress }) {
    const [openAccordion, setOpenAccordion] = useState(2);
    const [shippingAddress, setShippingAddress] = useState({});
    const [receiverAddress, setReceiverAddress] = useState({});

    useEffect(() => {
        if (openAccordion === 1) {
            onChangeAddress({
                receiver_name: defaultData.name,
                receiver_phone: defaultData.phone_number,
                receiver_address: defaultData.address,
            });
        } else {
            onChangeAddress(shippingAddress);
        }

        return () => onChangeAddress({});
    }, [openAccordion]);

    useEffect(() => {
        if (defaultData) {
            setOpenAccordion(1);
        } else {
            setOpenAccordion(2);
        }

        return () => setOpenAccordion(2);
    }, [defaultData]);

    const handleOpen = (value) => setOpenAccordion(value);

    const handleSelectDefaultAddress = () => {
        onChangeAddress({
            receiver_name: defaultData.name,
            receiver_phone: defaultData.phone_number,
            receiver_address: defaultData.address,
        });
    };

    const handleSelectNewAddress = () => {
        onChangeAddress(shippingAddress);
    };

    const handleOnChange = (key, value) => {
        setShippingAddress((prevState) => ({
            ...prevState,
            [key]: value,
        }));

        if (openAccordion === 2) {
            onChangeAddress(shippingAddress);
        }
    };

    const handleOnChangeAddress = (key, value) => {
        setReceiverAddress((prevState) => ({
            ...prevState,
            [key]: value,
        }));

        const { location, ...rest } = receiverAddress;

        const addressArray = Object.values(rest);

        handleOnChange('receiver_address', [...addressArray, location].reverse().join(' - '));
    };

    return (
        <div className="grid gap-4">
            <div className="grid gap-4">
                <Typography as="h3" className="text-xl font-semibold">
                    Giao hàng
                </Typography>
            </div>

            <div className="border-t border-blue-gray-100">
                {defaultData ? (
                    <Accordion
                        open={openAccordion === 1}
                        icon={<Icon checked={openAccordion === 1} />}
                        className="select-none border border-blue-gray-100 border-t-transparent px-4"
                    >
                        <AccordionHeader
                            onClick={() => {
                                handleSelectDefaultAddress();
                                handleOpen(1);
                            }}
                            className={`border-b-0 text-sm font-semibold transition-none ${
                                openAccordion === 1 ? 'text-blue-500' : null
                            }`}
                        >
                            Sử dụng địa chỉ mặc định
                        </AccordionHeader>
                        <AccordionBody className="grid gap-4 pt-0 text-sm font-normal">
                            <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                <Typography className="text-sm font-medium">{currentUser.name}</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <PhoneIcon className="h-4 w-4" />
                                <Typography className="text-sm font-medium">{currentUser.phone_number}</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="h-4 w-4" />
                                <Typography className="text-sm font-medium">{currentUser.address}</Typography>
                            </div>
                        </AccordionBody>
                    </Accordion>
                ) : null}

                <Accordion
                    open={openAccordion === 2}
                    icon={<Icon checked={openAccordion === 2} />}
                    className="select-none border border-blue-gray-100 border-t-transparent px-4"
                >
                    <AccordionHeader
                        onClick={() => {
                            handleOpen(2);
                            handleSelectNewAddress();
                        }}
                        className={`border-b-0 text-sm font-semibold transition-none ${
                            openAccordion === 2 ? 'text-blue-500' : null
                        }`}
                    >
                        Địa chỉ nhận hàng mới
                    </AccordionHeader>
                    <AccordionBody className="grid gap-4 pt-1 text-sm font-normal">
                        <Input
                            size="lg"
                            color="blue"
                            required
                            label="Tên người nhận"
                            value={shippingAddress.receiver_name ?? ''}
                            onChange={(e) => handleOnChange('receiver_name', e.target.value)}
                        />
                        <Input
                            size="lg"
                            color="blue"
                            required
                            label="Sđt nhận hàng"
                            value={shippingAddress.receiver_phone ?? ''}
                            onChange={(e) => handleOnChange('receiver_phone', e.target.value)}
                        />
                        <CustomAddressSelection address={receiverAddress ?? {}} onChange={handleOnChangeAddress} />
                    </AccordionBody>
                </Accordion>
            </div>
        </div>
    );
}

export default CustomShippingAddressCard;

function Icon({ checked }) {
    const CheckedMark = () => (
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
    return (
        <div className="relative translate-x-3">
            <Radio color="blue" className="h-4 w-4" readOnly checked={checked} icon={<CheckedMark />} />
        </div>
    );
}
