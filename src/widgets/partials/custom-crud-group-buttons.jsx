import { Button } from '@material-tailwind/react';
import PropTypes from 'prop-types';

export function CustomCrudGroupButtons({ btnConfirn, btnDelete, btnCancel }) {

    return (
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {btnConfirn && (
                <Button
                    color="blue"
                    variant="gradient"
                    fullWidth
                    disabled={btnConfirn.disabled}
                    className="flex w-full items-center justify-center gap-3"
                    onClick={btnConfirn?.onClick}
                >
                    <span className="relative top-px whitespace-nowrap">{btnConfirn.text}</span>
                </Button>
            )}

            {btnDelete && (
                <Button
                    color="red"
                    variant="gradient"
                    fullWidth
                    disabled={btnDelete.disabled}
                    className="flex w-full items-center justify-center gap-3"
                    onClick={btnDelete?.onClick}
                >
                    <span className="relative top-px whitespace-nowrap">{btnDelete.text}</span>
                </Button>
            )}

            {btnCancel && (
                <Button
                    color="gray"
                    variant="gradient"
                    fullWidth
                    className="flex w-full items-center justify-center gap-3"
                    onClick={btnCancel?.onClick}
                >
                    <span className="relative top-px whitespace-nowrap">{btnCancel.text}</span>
                </Button>
            )}
        </div>
    );
}

CustomCrudGroupButtons.defaultProps = {
    btnCancel: {
        text: 'Trở về',
    },
};

CustomCrudGroupButtons.propTypes = {
    btnConfirn: PropTypes.object,
    btnDelete: PropTypes.object,
    btnCancel: PropTypes.object,
};

export default CustomCrudGroupButtons;
