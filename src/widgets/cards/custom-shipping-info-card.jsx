import { Radio, Typography } from '@material-tailwind/react';
import PropTypes from 'prop-types';
import { CustomCurrencyDisplay } from '../partials';

export function CustomShippingInfoCard({ fee, title }) {
    return (
        <div className="relative overflow-hidden rounded-lg border border-blue-gray-100 p-3 pl-12">
            <div className="absolute top-0.5 left-0.5">
                <Radio size="6px" color="blue" value={title} defaultChecked/>
            </div>

            <div className="grid gap-2">
                <CustomCurrencyDisplay value={fee} className="font-semibold text-blue-500/80" />
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
                    {title}
                </Typography>
                <Typography className="text-xs font-normal text-gray-400">{Date.now()}</Typography>
            </div>
        </div>
    );
}

CustomShippingInfoCard.defaultProps = {
    fee: 30000,
    title: 'Giao hàng nhanh',
};

CustomShippingInfoCard.propTypes = {
    fee: PropTypes.number,
    title: PropTypes.string,
};

export default CustomShippingInfoCard;
