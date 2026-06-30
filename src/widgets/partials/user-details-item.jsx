import { Typography } from '@material-tailwind/react';
import PropTypes from 'prop-types';

export function UserDetailsItem({ label, text, encrypt, loading }) {
    if (!loading) {
        return (
            <div className="pb-1">
                <Typography as="h6" className="text-xs font-normal text-blue-gray-500">
                    {label}
                </Typography>
                <Typography as="h4" className="text-sm font-medium text-blue-gray-700">
                    {encrypt === 'password' ? '*'.repeat(12) : encrypt ? `${text.slice(0, 3)}${'*'.repeat(9)}` : text}
                </Typography>
            </div>
        );
    }

    return (
        <div className="container">
            <Typography as="h6" className="mb-1 w-1/2 animate-pulse bg-gray-300 text-xs text-transparent">
                {label}
            </Typography>
            <Typography as="h4" className="animate-pulse bg-gray-300 text-sm text-transparent">
                {text}
            </Typography>
        </div>
    );
}

UserDetailsItem.propTypes = {
    label: PropTypes.string,
    text: PropTypes.any,
    encrypt: PropTypes.string,
    loading: PropTypes.bool,
};

export default UserDetailsItem;