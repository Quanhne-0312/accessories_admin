import { Typography } from '@material-tailwind/react';
import PropTypes from 'prop-types';

export function CustomCurrencyDisplay({ value, className }) {
    const numericValue = Number(value) || 0;
    const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 2 };
    const formatedValue = new Intl.NumberFormat('vi-VN', config).format(numericValue);

    return (
            <Typography className={className}>
                {formatedValue}
            </Typography>
    );
}

CustomCurrencyDisplay.propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
};

export default CustomCurrencyDisplay;
