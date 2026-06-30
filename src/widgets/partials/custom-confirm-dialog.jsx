import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/solid';
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Spinner,
    Typography,
} from '@material-tailwind/react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export function CustomConfirmDialog({
    handler,
    status,
    open,
    title,
    text,
    countdown,
    btnConfirm,
    btnDelete,
    btnCancel,
    onConfirm,
    onDelete,
    onCancel,
}) {
    const [disabled, setDisabled] = useState(false);
    const [icon, setIcon] = useState(<InformationCircleIcon className="h-6 w-6" />);

    useEffect(() => {
        switch (status) {
            case 'PENDING':
                setIcon(<Spinner className="h-5 w-5 text-blue-gray-500" />);
                break;
            case 'SUCCESS':
                setIcon(<CheckCircleIcon className="h-6 w-6 text-green-600" />);
                break;
            case 'ERROR':
                setIcon(<ExclamationCircleIcon className="h-6 w-6 text-red-500" />);
                break;
            case 'WARNING':
                setIcon(<ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />);
                break;
            default:
                setIcon(<InformationCircleIcon className="h-6 w-6 text-blue-500" />);
                break;
        }
    }, [status]);

    useEffect(() => {
        if (status === 'PENDING' || countdown) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [status, countdown]);

    return (
        <Dialog open={open} handler={!disabled ? handler : null}>
            <DialogHeader className="flex items-center justify-center text-base">
                <span>{title}</span>
            </DialogHeader>
            <DialogBody>
                <div className="flex items-center justify-center gap-2">
                    {icon}
                    <Typography as={'p'} className="animation-float text-sm font-medium">
                        {text}
                    </Typography>
                </div>
                {countdown && (
                    <Typography as={'p'} className="animation-float mt-2 text-center text-sm">
                        Tự động chuyển hướng sau:
                        <strong className="w-10 text-right">{countdown}</strong>
                    </Typography>
                )}
            </DialogBody>
            <DialogFooter className="flex flex-wrap items-center justify-center gap-2">
                {btnConfirm && (
                    <Button
                        size="sm"
                        color="blue"
                        variant="text"
                        onClick={onConfirm}
                        disabled={disabled}
                    >
                        <span>{btnConfirm}</span>
                    </Button>
                )}
                {btnDelete && (
                    <Button
                        size="sm"
                        color="red"
                        variant="text"
                        onClick={onDelete}
                        disabled={disabled}
                    >
                        <span>{btnDelete}</span>
                    </Button>
                )}
                {btnCancel && (
                    <Button
                        size="sm"
                        color="gray"
                        variant="text"
                        onClick={onCancel}
                        disabled={disabled}
                    >
                        <span>{btnCancel}</span>
                    </Button>
                )}
            </DialogFooter>
        </Dialog>
    );
}

CustomConfirmDialog.defaultProps = {
    open: false,
    status: 'READY',
    title: 'Dialog title',
    text: 'Dialog text',
};

CustomConfirmDialog.propTypes = {
    open: PropTypes.bool,
    handler: PropTypes.func,
    status: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    countdown: PropTypes.number,
    btnConfirm: PropTypes.string,
    btnDelete: PropTypes.string,
    btnCancel: PropTypes.string,
    onConfirm: PropTypes.func,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
};

export default CustomConfirmDialog;
