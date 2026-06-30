import { setOpenConfigurator, setOpenSidenav, useMaterialTailwindController } from '@/context';
import {
    Bars3Icon,
    BellIcon,
    ClockIcon,
    Cog6ToothIcon,
    CreditCardIcon,
    UserCircleIcon,
} from '@heroicons/react/24/solid';
import {
    Avatar,
    Button,
    IconButton,
    Input,
    Menu,
    MenuHandler,
    MenuItem,
    MenuList,
    Navbar,
    Typography,
} from '@material-tailwind/react';
import { Link } from 'react-router-dom';

export function DashboardNavbar({ brandImg, brandName }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { openSidenav } = controller;

    return (
        <Navbar
            color="white"
            className="sticky top-0 z-40 h-20 border-b border-gray-400/50 p-0 shadow-md shadow-blue-gray-500/5"
            blurred={false}
            fullWidth
        >
            <div className="flex h-full w-full items-center justify-between md:justify-end">
                <div className="mr-auto p-4 md:mr-0 md:w-80">
                    <Input label="Type here" />
                </div>
                <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => setOpenConfigurator(dispatch, true)}
                >
                    <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
                </IconButton>
                <Menu>
                    <MenuHandler>
                        <IconButton variant="text" color="blue-gray">
                            <BellIcon className="h-5 w-5 text-blue-gray-500" />
                        </IconButton>
                    </MenuHandler>
                    <MenuList className="w-max border-0">
                        <MenuItem className="flex items-center gap-3">
                            <Avatar
                                src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                                alt="item-1"
                                size="sm"
                                variant="circular"
                            />
                            <div>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-1 font-normal"
                                >
                                    <strong>New message</strong> from Laur
                                </Typography>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                                >
                                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                                </Typography>
                            </div>
                        </MenuItem>
                        <MenuItem className="flex items-center gap-4">
                            <Avatar
                                src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                                alt="item-1"
                                size="sm"
                                variant="circular"
                            />
                            <div>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-1 font-normal"
                                >
                                    <strong>New album</strong> by Travis Scott
                                </Typography>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                                >
                                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                                </Typography>
                            </div>
                        </MenuItem>
                        <MenuItem className="flex items-center gap-4">
                            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                                <CreditCardIcon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-1 font-normal"
                                >
                                    Payment successfully completed
                                </Typography>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                                >
                                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                                </Typography>
                            </div>
                        </MenuItem>
                    </MenuList>
                </Menu>
                <IconButton
                    variant="text"
                    color="blue-gray"
                    className="grid xl:hidden"
                    onClick={() => setOpenSidenav(dispatch, !openSidenav)}
                >
                    <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
                </IconButton>
            </div>
        </Navbar>
    );
}

DashboardNavbar.defaultProps = {
    brandImg: '/img/logo-ct.png',
    brandName: 'Accessories Ahihi',
};

export default DashboardNavbar;
