import { AdjustmentsVerticalIcon, EllipsisVerticalIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/solid';
import { IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from '@material-tailwind/react';
import PropTypes from 'prop-types';

export function CustomCrudMenu({ placement, onPreview, onUpdate, onDelete }) {
    const menulist = [
        {
            text: 'Chi tiết',
            icon: <EyeIcon className="h-5 w-5" />,
            onClick: onPreview,
        },
        {
            text: 'Chỉnh sửa',
            icon: <AdjustmentsVerticalIcon className="h-5 w-5" />,
            onClick: onUpdate,
        },
        {
            text: 'Xóa',
            icon: <TrashIcon className="h-5 w-5" />,
            onClick: onDelete,
        },
    ];

    return (
        <Menu placement={placement}>
            <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                    <EllipsisVerticalIcon className="ml-0.5 h-5 w-5 text-blue-gray-500" />
                </IconButton>
            </MenuHandler>
            <MenuList variant={'right'} className="w-max">
                {menulist.map(({ text, icon, onClick }) => (
                    <MenuItem key={text} className="flex items-center justify-between gap-3" onClick={onClick}>
                        <Typography variant="small" color="blue-gray">
                            {text}
                        </Typography>
                        {icon}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}

CustomCrudMenu.defaultProps = {
    placement: 'bottom-end',
};

CustomCrudMenu.propTypes = {
    onPreview: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default CustomCrudMenu;
