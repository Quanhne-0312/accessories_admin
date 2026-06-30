import { useState } from 'react';
import { IconButton, Typography } from '@material-tailwind/react';
import PropTypes from 'prop-types';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export function CustomPagination({ current, total, onPagination }) {
    const next = () => {
        if (current === total) return;

        onPagination(current + 1);
    };

    const prev = () => {
        if (current === 1) return;

        onPagination(current - 1);
    };

    return (
        <div className="flex items-center gap-4">
            <IconButton size="sm" variant="text" onClick={prev} disabled={current === 1}>
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
            <Typography color="gray" className="text-sm">
                <strong className="font-semibold text-gray-900">{current}</strong>
                <span> / </span>
                <strong className="font-semibold text-gray-900">{total}</strong>
            </Typography>
            <IconButton size="sm" variant="text" onClick={next} disabled={current === total}>
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
        </div>
    );
}

CustomPagination.defaultProps = {
    current: 1,
    total: 1,
};

CustomPagination.propTypes = {
    current: PropTypes.number,
    total: PropTypes.number,
    onChange: PropTypes.func,
};
