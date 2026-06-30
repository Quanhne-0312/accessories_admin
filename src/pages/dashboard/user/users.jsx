import { userService } from '@/services';
import { CustomConfirmDialog, CustomCrudMenu, CustomPagination } from '@/widgets/partials';
import {
    ArrowsUpDownIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PlusIcon,
} from '@heroicons/react/24/solid';
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Collapse,
    Input,
    Menu,
    MenuHandler,
    MenuItem,
    MenuList,
    Radio,
    Typography,
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function Users() {
    const [isLoading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [openFilter, setOpenFilter] = useState(false);
    const [openSorter, setOpenSorter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [filterMenu, setFilterMenu] = useState([]);
    const [filteredRole, setFilteredRole] = useState('all');
    const [keyword, setKeyword] = useState('');
    const [dialog, setDialog] = useState({
        title: 'Xóa tài khoản',
        text: 'Xác nhận xóa tài khoản?',
    });
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.data);
    const dataTable = [
        {
            title: 'họ tên',
            key: 'name',
        },
        {
            title: 'số điện thoại',
            key: 'phone_number',
            className: 'text-left',
        },
        {
            title: 'email',
            key: 'email',
        },
        {
            title: 'địa chỉ',
            key: 'address',
        },
        {
            title: 'loại tài khoản',
            key: 'role',
        },
    ];

    const handleGetUsers = async (role_id, slug, page, searchKeyword = '') => {
        setLoading(true);
        const response = await userService.getUsersService(role_id, slug, page, searchKeyword);

        if (response && response.code === 'SUCCESS') {
            const { page, total_pages, total_results, result } = response;
            setUsers(result);
            setCurrentPage(Number(page));
            setTotalPages(Number(total_pages));
            setTotalResults(Number(total_results));
        }
        setLoading(false);
    };

    const handleGetProductsCount = async () => {
        setLoading(true);
        const response = await userService.getUsersCountService(currentUser?.role_id);
        if (response && response.code === 'SUCCESS') {
            setFilterMenu(response.result);
        }
        setLoading(false);
    };

    useEffect(() => {
        handleGetProductsCount();

        const title = document.title;

        document.title = 'Quản lý tài khoản';

        return () => (document.title = title);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            handleGetUsers(currentUser?.role_id, filteredRole, currentPage, keyword);
        }, 300);

        return () => clearTimeout(timeout);
    }, [filteredRole, currentPage, keyword, currentUser?.role_id]);

    /** DATA SUBMIT HANDLER */

    const handleDeleteUser = async (data) => {
        try {
            setDialog((prevState) => ({
                ...prevState,
                status: 'PENDING',
                text: 'Đang xử lý thông tin...',
            }));

            const response = await new Promise((resolve) => {
                setTimeout(async () => {
                    const result = await userService.deleteUserService(data);
                    resolve(result);
                }, 2000);
            });

            if (response && response.code === 'SUCCESS') {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'SUCCESS',
                    text: `Đã xóa tài khoản "${data.phone_number}".`,
                    icon: <CheckCircleIcon className="h-8 w-8 text-green-600" />,
                    onConfirm: handleCloseDialog,
                }));
                handleGetUsers(currentUser?.role_id, filteredRole, currentPage, keyword);
            } else {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'FAILURE',
                    text: 'Xóa tài khoản không thành công!',
                    icon: <ExclamationCircleIcon className="h-8 w-8 text-red-500" />,
                }));
            }
        } catch (error) {
            setDialog((prevState) => ({
                ...prevState,
                status: 'FAILURE',
                text: error?.message || error || 'Xóa tài khoản không thành công!',
                icon: <ExclamationCircleIcon className="h-8 w-8 text-red-500" />,
            }));
        }
    };

    const handleOpenDialog = (data) => {
        setDialog((prevState) => ({
            ...prevState,
            open: true,
            btnCancel: 'Hủy',
            btnConfirm: 'Xác nhận',
            handler: handleCloseDialog,
            onCancel: handleCloseDialog,
            onConfirm: () => handleDeleteUser(data),
        }));
    };

    const handleCloseDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: false,
        }));
    };

    const handleRedirectToCreate = () => {
        navigate(`/dashboard/user/create`);
    };

    const handleRedirectToPreview = (username) => {
        navigate(`/dashboard/user/detail/${username}`);
    };

    const handleRedirectToUpdate = (username) => {
        navigate(`/dashboard/user/update/${username}`);
    };

    const handleToggleFilter = () => {
        setOpenFilter((prevOpen) => !prevOpen);
    };

    const handleToggleSorter = () => {
        setOpenSorter((prevOpen) => !prevOpen);
    };
    
    const handleOnChangePagination = (value) => {
        setCurrentPage(value);
    };

    const handleSearch = (e) => {
        setKeyword(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterRole = (slug) => {
        setFilteredRole(slug);
        setCurrentPage(1);
    };

    /** FILTER */

    /**SORTER */

    const firstResultIndex = totalResults === 0 ? 0 : (currentPage - 1) * 12 + 1;
    const lastResultIndex = Math.min(currentPage * 12, totalResults);

    return (
        <div className="my-10 flex flex-col gap-12">
            <Typography variant="h4">Danh sách tài khoản</Typography>
            <Card>
                <CardHeader
                    color="transparent"
                    shadow={false}
                    floated={false}
                    className="m-0 p-4 pb-0"
                >
                    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
                        <div className="lg:col-span-2">
                            <Input
                                size="md"
                                label="Tìm kiếm"
                                color="blue-gray"
                                value={keyword}
                                onChange={handleSearch}
                                icon={<MagnifyingGlassIcon className="h-4 w-4" />}
                            />
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-3 sm:flex-nowrap md:col-span-2 lg:col-span-3">
                            <Button
                                size="md"
                                color="blue"
                                variant="gradient"
                                className="flex w-full items-center justify-center gap-1 pl-4 sm:w-max"
                                onClick={handleRedirectToCreate}
                            >
                                <PlusIcon className="h-4 w-4" />
                                <span>Tài khoản mới</span>
                            </Button>

                            <Button
                                size="md"
                                color="blue-gray"
                                variant="outlined"
                                className="flex w-[calc(50%-6px)] items-center justify-center gap-1 pl-4 sm:w-max"
                                onClick={handleToggleFilter}
                            >
                                <FunnelIcon className="h-4 w-4" />
                                Bộ lọc
                            </Button>

                            <Button
                                size="md"
                                color="blue-gray"
                                variant="outlined"
                                className="flex w-[calc(50%-6px)] items-center justify-center gap-1 pl-4 sm:w-max"
                                onClick={handleToggleSorter}
                            >
                                <ArrowsUpDownIcon className="h-4 w-4" />
                                Sắp xếp
                            </Button>
                        </div>
                    </div>

                    <Collapse open={openFilter}>
                        <div className="mt-4 rounded-lg border border-blue-gray-100 p-4">
                            <Typography className="ml-2 mb-2 text-sm font-semibold">
                                Phân quyền
                            </Typography>
                            <div className="grid grid-cols-2 gap-x-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                <Radio
                                    color="blue"
                                    name="role"
                                    value="all"
                                    label={
                                        <span className="text-xs font-medium">
                                            {`Tất cả (${filterMenu.reduce((sum, user) => {
                                                return sum + Number(user.user_count);
                                            }, 0)})`}
                                        </span>
                                    }
                                    checked={filteredRole === 'all'}
                                    onChange={() => handleFilterRole('all')}
                                />
                                {filterMenu &&
                                    filterMenu.length > 0 &&
                                    filterMenu.map((item) => (
                                        <Radio
                                            color="blue"
                                            name="role"
                                            key={item.id}
                                            value={item.slug}
                                            label={
                                                <span className="text-xs font-medium line-clamp-1">
                                                    {`${item.name} (${item.user_count})`}
                                                </span>
                                            }
                                            checked={filteredRole === item.slug}
                                            onChange={() => handleFilterRole(item.slug)}
                                        />
                                    ))}
                            </div>
                        </div>
                    </Collapse>

                    <Collapse open={openSorter}>
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            <Menu>
                                <MenuHandler>
                                    <Button
                                        size="sm"
                                        color="blue-gray"
                                        variant="outlined"
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <ArrowsUpDownIcon className="h-4 w-4" />
                                        <span>tên</span>
                                    </Button>
                                </MenuHandler>
                                <MenuList>
                                    <MenuItem>a-z A-Z</MenuItem>
                                    <MenuItem>z-a Z-A</MenuItem>
                                </MenuList>
                            </Menu>
                        </div>
                    </Collapse>
                </CardHeader>
                <CardBody className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {dataTable.map((item) => (
                                        <th
                                            key={item.key}
                                            className="text-ellipsis whitespace-nowrap border-t border-blue-gray-100 first:text-left"
                                        >
                                            <Typography className="py-3 px-5 text-xs font-bold uppercase">
                                                {item.title}
                                            </Typography>
                                        </th>
                                    ))}
                                    <th className="border-t border-blue-gray-100"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.length > 0 ? (
                                    users.map((item, index) => (
                                        <tr key={index}>
                                            {dataTable.map((col) => (
                                                <td
                                                    key={col.key}
                                                    className="text-ellipsis border-t border-blue-gray-100 py-3 px-5"
                                                >
                                                    {col.key === 'role' ? (
                                                        <Chip
                                                            variant="gradient"
                                                            color={
                                                                item.role_id === 0
                                                                    ? 'deep-orange'
                                                                    : item.role_id === 1
                                                                    ? 'deep-purple'
                                                                    : item.role_id === 2
                                                                    ? 'blue'
                                                                    : 'blue-gray'
                                                            }
                                                            value={item[col.key]}
                                                            className="w-max py-px text-xs"
                                                        />
                                                    ) : col.key === 'name' ? (
                                                        <div className="flex items-center gap-2">
                                                            <Avatar
                                                                size="sm"
                                                                withBorder
                                                                color="blue-gray"
                                                                alt={item[col.key]}
                                                                src={
                                                                    item.avatar_url ??
                                                                    '/img/default-avatar.jpg'
                                                                }
                                                                className="border p-px"
                                                            />
                                                            <Typography className="whitespace-nowrap font-semibold">
                                                                {item[col.key]}
                                                            </Typography>
                                                        </div>
                                                    ) : (
                                                        <Typography
                                                            className={`${
                                                                col.key === 'address'
                                                                    ? 'min-w-[240px] line-clamp-1'
                                                                    : 'whitespace-nowrap italic'
                                                            } font-medium text-gray-500`}
                                                        >
                                                            {item[col.key]}
                                                        </Typography>
                                                    )}
                                                </td>
                                            ))}
                                            <td className="border-t border-blue-gray-100 py-3 pl-5 text-right">
                                                <CustomCrudMenu
                                                    onPreview={() =>
                                                        handleRedirectToPreview(item.phone_number)
                                                    }
                                                    onUpdate={() =>
                                                        handleRedirectToUpdate(item.phone_number)
                                                    }
                                                    onDelete={() => handleOpenDialog(item)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={dataTable.length + 1}
                                            className="w-full text-ellipsis whitespace-nowrap border-t border-blue-gray-100 py-3 px-5"
                                        >
                                            Không có bản ghi dữ liệu người dùng nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
                <CardFooter className="pt-0 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
                        <Typography color="gray" className="flex gap-1 text-sm">
                            <strong className="font-semibold text-gray-900">
                                {firstResultIndex}
                            </strong>
                            <span>-</span>
                            <strong className="font-semibold text-gray-900">
                                {lastResultIndex}
                            </strong>
                            <span>of</span>
                            <strong className="font-semibold text-gray-900">
                                {totalResults * 1}
                            </strong>
                        </Typography>

                        <CustomPagination
                            current={currentPage}
                            total={totalPages}
                            onPagination={handleOnChangePagination}
                        />
                    </div>
                </CardFooter>
            </Card>

            <CustomConfirmDialog {...dialog} />
        </div>
    );
}

export default Users;
