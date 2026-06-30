import { productService } from '@/services';
import { CustomProductCard } from '@/widgets/cards';
import { CustomConfirmDialog, CustomPagination } from '@/widgets/partials';
import {
    ArrowsUpDownIcon,
    ChevronDownIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PlusIcon,
} from '@heroicons/react/24/solid';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Checkbox,
    Collapse,
    Input,
    Menu,
    MenuHandler,
    MenuItem,
    MenuList,
    Typography,
} from '@material-tailwind/react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function Products() {
    const [products, setProducts] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [openSorter, setOpenSorter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [filterMenu, setFilterMenu] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [dialog, setDialog] = useState({
        title: 'Xóa sản phẩm',
        text: 'Xác nhận xóa sản phẩm?',
    });
    let [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleGetProducts = async (categories, page, keyword = '') => {
        setLoading(true);
        const normalizedKeyword = keyword.trim();
        const response = normalizedKeyword
            ? await productService.searchProductsService(normalizedKeyword, page)
            : await productService.getProductsService(categories, page);
        if (response && response.code === 'SUCCESS') {
            const { page, total_pages, total_results, result } = response;
            setProducts(result);
            setCurrentPage(Number(page));
            setTotalPages(Math.max(1, Number(total_pages) || 1));
            setTotalResults(Number(total_results));
        }
        setLoading(false);
    };

    const handleGetProductsCount = async () => {
        setLoading(true);
        const response = await productService.getProductsCountService();
        if (response && response.code === 'SUCCESS') {
            const categoryFilter = response.result?.find((item) => item.count_by === 'category');
            setFilterMenu(categoryFilter?.data ?? response.result);
        }
        setLoading(false);
    };

    useEffect(() => {
        handleGetProductsCount();

        const title = document.title;

        document.title = 'Quản lý sản phẩm';

        return () => (document.title = title);
    }, []);

    useEffect(() => {
        setSearchParams(`category=${filteredCategories.join('+') || 'all'}`);

        const encodedCategories = encodeURIComponent(filteredCategories.join(',') || 'all');

        const timer = setTimeout(() => {
            handleGetProducts(encodedCategories, currentPage, searchKeyword);
        }, 300);

        return () => clearTimeout(timer);
    }, [currentPage, filteredCategories, searchKeyword]);

    const handleToggleFilter = () => {
        setOpenFilter((prevOpen) => !prevOpen);
    };
    const handleToggleSorter = () => {
        setOpenSorter((prevOpen) => !prevOpen);
    };
    const handleOnChangePagination = (value) => {
        setCurrentPage(value);
    };
    const handleSearchProducts = (event) => {
        setSearchKeyword(event.target.value);
        setCurrentPage(1);
    };
    const handleRedirectToCreate = () => {
        navigate(`/dashboard/product/create`);
    };
    const handleRedirectToPreview = (id) => {
        navigate(`/dashboard/product/detail/${id}`);
    };
    const handleRedirectToUpdate = (id) => {
        navigate(`/dashboard/product/update/${id}`);
    };
    const updateUiProducts = (id) => {
        const newProducts = products.filter((item) => item.id !== id);
        setProducts(newProducts);
    };

    /** FILTER */

    const handleOnFilterCategories = (value) => {
        const isValueSelected = filteredCategories.includes(value);
        const newOption = isValueSelected
            ? filteredCategories.filter((item) => item !== value)
            : [...filteredCategories, value];
        setFilteredCategories(newOption);
    };

    const handleResetFilteredCategories = () => {
        setFilteredCategories([]);
    };

    /** SORTER */

    const handleSortByPrice = (type) => {
        setLoading(true);
        if (type === 'desc') {
            const descSortedProducts = [...products].sort((a, b) => b.price - a.price);
            setProducts(descSortedProducts);
        } else if (type === 'asc') {
            const ascSortedProducts = [...products].sort((a, b) => a.price - b.price);
            setProducts(ascSortedProducts);
        }
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    /** DATA SUBMIT HANDLER */

    const handleDeleteProduct = async (data) => {
        try {
            setDialog((prevState) => ({
                ...prevState,
                status: 'PENDING',
                text: 'Đang xử lý thông tin...',
            }));

            const response = await new Promise((resolve) => {
                setTimeout(async () => {
                    const result = await productService.deleteProductService(data);
                    resolve(result);
                }, 2000);
            });

            if (response && response.code === 'SUCCESS') {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'SUCCESS',
                    text: `Đã xóa "${data.name}".`,
                    btnCancel: 'Thoát',
                    btnDelete: 'Xác nhận',
                    onDelete: handleCloseDialog,
                }));
                updateUiProducts(data.id);
            } else {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'ERROR',
                    btnDelete: 'Thử lại',
                    text: 'Xóa sản phẩm không thành công!',
                }));
            }
        } catch (error) {
            setDialog((prevState) => ({
                ...prevState,
                status: 'ERROR',
                btnConfirm: 'Thử lại',
                text: error?.message || error || 'Xóa sản phẩm không thành công!',
            }));
        }
    };

    const handleOpenDeleteDialog = (data) => {
        setDialog((prevState) => ({
            ...prevState,
            open: true,
            status: 'WARNING',
            title: 'Xóa sản phẩm',
            text: 'Xác nhận xóa sản phẩm này?',
            handler: handleCloseDialog,
            btnCancel: 'Hủy',
            onCancel: handleCloseDialog,
            btnDelete: 'Xoá',
            onDelete: () => handleDeleteProduct(data),
        }));
    };

    const handleCloseDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: false,
        }));
    };

    return (
        <div className="my-10 flex flex-col gap-12">
            <Typography variant="h4">Danh sách sản phẩm</Typography>
            <Card>
                <CardBody className="p-4">
                    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
                        <div className="lg:col-span-2">
                            <Input
                                size="md"
                                label="Tìm kiếm"
                                color="blue-gray"
                                value={searchKeyword}
                                onChange={handleSearchProducts}
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
                                <span>Sản phẩm mới</span>
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
                                Danh mục
                            </Typography>
                            <div className="grid grid-cols-2 gap-x-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                <Checkbox
                                    color="blue"
                                    value={'all'}
                                    label={
                                        <span className="text-xs font-medium">
                                            {`Tất cả (${filterMenu.reduce((sum, product) => {
                                                return sum + Number(product.product_count);
                                            }, 0)})`}
                                        </span>
                                    }
                                    checked={filteredCategories.length === 0 ? true : false}
                                    onChange={handleResetFilteredCategories}
                                />
                                {filterMenu &&
                                    filterMenu.length > 0 &&
                                    filterMenu.map((item) => (
                                        <Checkbox
                                            color="blue"
                                            key={item.id}
                                            value={item.slug}
                                            label={
                                                <span className="text-xs font-medium line-clamp-1">
                                                    {`${item.name} (${item.product_count})`}
                                                </span>
                                            }
                                            checked={
                                                filteredCategories.includes(item.slug)
                                                    ? true
                                                    : false
                                            }
                                            onChange={() => handleOnFilterCategories(item.slug)}
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
                            <Menu>
                                <MenuHandler>
                                    <Button
                                        size="sm"
                                        color="blue-gray"
                                        variant="outlined"
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <ArrowsUpDownIcon className="h-4 w-4" />
                                        <span>giá</span>
                                    </Button>
                                </MenuHandler>
                                <MenuList>
                                    <MenuItem onClick={() => handleSortByPrice('asc')}>
                                        Thấp dến cao
                                    </MenuItem>
                                    <MenuItem onClick={() => handleSortByPrice('desc')}>
                                        Cao đến thấp
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            <Menu>
                                <MenuHandler>
                                    <Button
                                        size="sm"
                                        color="blue-gray"
                                        variant="outlined"
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <ArrowsUpDownIcon className="h-4 w-4" />
                                        <span>đã bán</span>
                                    </Button>
                                </MenuHandler>
                                <MenuList>
                                    <MenuItem>Bán nhiều</MenuItem>
                                    <MenuItem>Bán ít</MenuItem>
                                </MenuList>
                            </Menu>
                        </div>
                    </Collapse>

                    <div className="mt-4 grid gap-3">
                        {isLoading ? (
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((element) => (
                                <CustomProductCard key={element} />
                            ))
                        ) : !_.isEmpty(products) ? (
                            products.map((item, index) => (
                                <CustomProductCard
                                    key={index}
                                    data={item}
                                    onPreview={() => handleRedirectToPreview(item.id)}
                                    onUpdate={() => handleRedirectToUpdate(item.id)}
                                    onDelete={() => handleOpenDeleteDialog(item)}
                                />
                            ))
                        ) : (
                            <Typography className="text-ellipsis whitespace-nowrap px-2">
                                Không có dữ liệu sản phẩm phù hợp
                            </Typography>
                        )}
                    </div>
                </CardBody>

                <CardFooter className="pt-0 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
                        <Typography color="gray" className="flex gap-1 text-sm">
                            <strong className="font-semibold text-gray-900">
                                {totalResults > 0 ? currentPage * 12 - 11 : 0}
                            </strong>
                            <span>-</span>
                            <strong className="font-semibold text-gray-900">
                                {currentPage * 12 < totalResults ? currentPage * 12 : totalResults}
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

export default Products;

const AccordionOpenButton = ({ id, open }) => (
    <ChevronDownIcon
        className={`h-4 w-4 transition-all ${open === id ? 'rotate-180' : 'rotate-0'}`}
    />
);
