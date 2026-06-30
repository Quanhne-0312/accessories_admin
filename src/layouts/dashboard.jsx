import routes from '@/routes';
import { canAccess } from '@/utils/permissions';
import { Configurator, DashboardNavbar, Sidenav } from '@/widgets/layout';
import { Breadcrumbs, Typography } from '@material-tailwind/react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function Dashboard() {
    const { pathname } = useLocation();
    const user = useSelector((state) => state.user.data);
    const paths = pathname.split('/').filter((el) => el !== '');

    const protectRoute = (route) =>
        canAccess(user, route.permissions) ? route.element : <Navigate to="/dashboard/profile" replace />;

    return (
        <div className="min-h-screen bg-blue-gray-50/50">
            <Sidenav routes={routes} />
            <DashboardNavbar />
            <div className="p-4 xl:ml-80">
                <Configurator />
                <div className="capitalize">
                    <Breadcrumbs className="mt-2 bg-transparent p-0 py-3 transition-all">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                            {paths[0]}
                        </Typography>
                        {paths.length > 2 &&
                            paths.slice(1, -1).map((path, index) => (
                                <Link key={index} to={`/${paths.slice(0, index + 2).join('/')}`}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal transition-all hover:text-blue-500 hover:underline"
                                    >
                                        {path}
                                    </Typography>
                                </Link>
                            ))}
                        <Typography variant="small" color="blue-gray" className="font-normal">
                            {paths[paths.length - 1]}
                        </Typography>
                    </Breadcrumbs>
                </div>
                <Routes>
                    {routes.map(
                        ({ layout, pages }) =>
                            layout === 'dashboard' &&
                            pages.map(({ path, element, permissions, routes: nestedRoutes }) =>
                                nestedRoutes ? (
                                    nestedRoutes.map((item) => (
                                        <Route
                                            key={item.path}
                                            path={item.path}
                                            element={protectRoute(item)}
                                        />
                                    ))
                                ) : (
                                    <Route
                                        key={path}
                                        path={path}
                                        element={protectRoute({ element, permissions })}
                                    />
                                ),
                            ),
                    )}
                </Routes>
            </div>
        </div>
    );
}

Dashboard.displayName = '/src/layout/dashboard.jsx';

export default Dashboard;
