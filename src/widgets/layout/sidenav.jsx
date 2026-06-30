import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { PowerIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Avatar, Button, IconButton, Typography } from '@material-tailwind/react';
import { useMaterialTailwindController, setOpenSidenav } from '@/context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/actions/userAction';
import { authService } from '@/services';
import { filterDashboardPages } from '@/utils/permissions';

export function Sidenav({ brandImg, brandName, routes }) {
    const [controllerMT, dispatchMT] = useMaterialTailwindController();
    const { openSidenav: open } = controllerMT;
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.data);
    const filteredRoutes = routes.map((route) =>
        route.layout === 'dashboard'
            ? { ...route, pages: filterDashboardPages(route.pages, user) }
            : route,
    );

    const handleLogout = async () => {
        const isLogout = await authService.logoutService(user.phone_number);
        if (isLogout) {
            dispatch(logout());
        }
    };

    return (
        <aside
            className={`${open ? 'translate-x-0' : '-translate-x-80'} 
            fixed inset-0 z-50 flex w-80 flex-col bg-gradient-to-br from-blue-gray-700 to-blue-gray-900 transition-transform duration-300 xl:translate-x-0`}
        >
            <div className={`relative border-b border-gray-400/50`}>
                <Link to="/" className="flex h-20 items-center gap-4 px-8">
                    <Avatar src={brandImg} size="sm" />
                    <Typography variant="h6" color={'white'}>
                        {brandName}
                    </Typography>
                </Link>
                <IconButton
                    variant="text"
                    color="white"
                    size="sm"
                    ripple={false}
                    className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
                    onClick={() => setOpenSidenav(dispatchMT, false)}
                >
                    <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
                </IconButton>
            </div>
            <div className="h-full p-4">
                {filteredRoutes
                    .filter(({ layout }) => layout === 'dashboard')
                    .map(({ layout, pages }) => (
                    <ul key={layout} className="mb-4 flex h-full flex-col gap-1">
                        {pages.map(({ icon, name, path }) => (
                            <li key={path}>
                                <NavLink to={`/${layout}${path}`}>
                                    {({ isActive }) => (
                                        <Button
                                            variant={isActive ? 'gradient' : 'text'}
                                            color={isActive ? 'blue' : 'white'}
                                            className="flex items-center gap-4 px-4 capitalize"
                                            fullWidth
                                        >
                                            {icon}
                                            <Typography
                                                color="inherit"
                                                className="font-medium capitalize"
                                            >
                                                {name}
                                            </Typography>
                                        </Button>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                        <li className="mt-auto">
                            <Button
                                variant={'text'}
                                color={'white'}
                                className="flex items-center gap-4 px-4 capitalize"
                                onClick={handleLogout}
                                fullWidth
                            >
                                <PowerIcon className="h-5 w-5 text-inherit" />
                                <Typography color="inherit" className="font-medium capitalize">
                                    Đăng xuất
                                </Typography>
                            </Button>
                        </li>
                    </ul>
                ))}
            </div>
        </aside>
    );
}

Sidenav.defaultProps = {
    brandImg: '/img/logo-ct.png',
    brandName: 'Accessories Ahihi',
};

Sidenav.propTypes = {
    brandImg: PropTypes.string,
    brandName: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
