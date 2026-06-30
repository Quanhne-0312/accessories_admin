import { Login } from '@/pages/auth';
import {
    CatalogOptions,
    Home,
    OrderDetails,
    OrderEditor,
    Orders,
    ProductDetails,
    ProductEditor,
    Products,
    Profile,
    ProfileUpdate,
    Tables,
    UserDetails,
    UserEditor,
    Users,
} from '@/pages/dashboard';
import {
    ArchiveBoxIcon,
    ClipboardDocumentListIcon,
    HomeIcon,
    TableCellsIcon,
    TagIcon,
    UserCircleIcon,
    UserIcon,
} from '@heroicons/react/24/solid';

const icon = {
    className: 'w-5 h-5 text-inherit',
};

export const routes = [
    {
        layout: 'dashboard',
        pages: [
            {
                icon: <HomeIcon {...icon} />,
                name: 'Bảng điều khiển',
                path: '/home',
                permissions: ['stats:read'],
                element: <Home />,
            },
            {
                icon: <UserCircleIcon {...icon} />,
                name: 'Trang cá nhân',
                path: '/profile',
                permissions: ['profile:read'],
                element: <Profile />,
                routes: [
                    {
                        path: '/profile',
                        permissions: ['profile:read'],
                        element: <Profile />,
                    },
                    {
                        path: '/profile/update',
                        permissions: ['profile:update'],
                        element: <ProfileUpdate />,
                    },
                ],
            },
            {
                icon: <TableCellsIcon {...icon} />,
                name: 'Tables',
                path: '/tables',
                permissions: ['stats:read'],
                element: <Tables />,
            },
            {
                icon: <UserIcon {...icon} />,
                name: 'Tài khoản',
                path: '/user',
                permissions: ['account:manage'],
                element: <Users />,
                routes: [
                    {
                        path: '/user',
                        permissions: ['account:manage'],
                        element: <Users />,
                    },
                    {
                        path: '/user/create',
                        permissions: ['account:manage'],
                        element: <UserEditor />,
                    },
                    {
                        path: '/user/detail/:username',
                        permissions: ['account:manage'],
                        element: <UserDetails />,
                    },
                    {
                        path: '/user/update/:username',
                        permissions: ['account:manage'],
                        element: <UserEditor />,
                    },
                ],
            },
            {
                icon: <ClipboardDocumentListIcon {...icon} />,
                name: 'Đơn hàng',
                path: '/order',
                permissions: ['order:manage'],
                element: <Orders />,
                routes: [
                    {
                        path: '/order',
                        permissions: ['order:manage'],
                        element: <Orders />,
                    },
                    {
                        path: '/order/create',
                        permissions: ['order:manage'],
                        element: <OrderEditor />,
                    },
                    {
                        path: '/order/detail/:orderuuid',
                        permissions: ['order:manage'],
                        element: <OrderDetails />,
                    },
                    {
                        path: '/order/update/:orderuuid',
                        permissions: ['order:manage'],
                        element: <OrderEditor />,
                    },
                ],
            },
            {
                icon: <ArchiveBoxIcon {...icon} />,
                name: 'Sản phẩm',
                path: '/product',
                permissions: ['product:manage'],
                element: <Products />,
                routes: [
                    {
                        path: '/product',
                        permissions: ['product:manage'],
                        element: <Products />,
                    },
                    {
                        path: '/product/create',
                        permissions: ['product:manage'],
                        element: <ProductEditor />,
                    },
                    {
                        path: '/product/detail/:id',
                        permissions: ['product:manage'],
                        element: <ProductDetails />,
                    },
                    {
                        path: '/product/update/:id',
                        permissions: ['product:manage'],
                        element: <ProductEditor />,
                    },
                ],
            },
            {
                icon: <TagIcon {...icon} />,
                name: 'Thuộc tính',
                path: '/catalog-options',
                permissions: ['product:manage'],
                element: <CatalogOptions />,
            },
        ],
    },
    {
        layout: 'auth',
        pages: [
            {
                path: '/login',
                element: <Login />,
            },
        ],
    },
];

export default routes;
