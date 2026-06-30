import { Button, Input } from '@material-tailwind/react';
import { useState } from 'react';

function CustomVoucherSubmit() {
    const [voucher, setVoucher] = useState('');
    const onChange = ({ target }) => setVoucher(target.value);

    return (
        <div className="relative flex w-full">
            <Input
                type="text"
                label="Mã giảm giá"
                color="blue"
                value={voucher}
                onChange={onChange}
                className="pr-20"
                containerProps={{
                    className: 'min-w-0',
                }}
            />
            <Button
                size="sm"
                color={voucher ? 'blue' : 'blue-gray'}
                disabled={!voucher}
                className="!absolute right-1 top-1 rounded"
            >
                Invite
            </Button>
        </div>
    );
}

export default CustomVoucherSubmit;
