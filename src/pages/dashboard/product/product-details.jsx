import { productService } from '@/services';
import {
    CustomConfirmDialog,
    CustomCrudGroupButtons,
    CustomCurrencyDisplay,
} from '@/widgets/partials';
import { Card, CardBody, CardFooter, Carousel, Typography } from '@material-tailwind/react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function ProductDetails() {
    const [isLoading, setLoading] = useState(false);
    const [productData, setProductData] = useState({});
    const [dialog, setDialog] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const displayImages =
        productData.images && !_.isEmpty(productData.images)
            ? productData.images
            : productData.feature_image_url
              ? [
                    {
                        public_id: `${productData.slug || productData.id}-feature`,
                        secure_url: productData.feature_image_url,
                    },
                ]
              : [];

    useEffect(() => {
        const handleGetProductById = async (id) => {
            setLoading(true);
            const response = await productService.getProductByIdService(id);
            if (response && response.code === 'SUCCESS') {
                setProductData(response.result);
            }
            setLoading(false);
        };
        handleGetProductById(id);
    }, []);

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
                }));

                let countdown = 50;
                const countdownInterval = setInterval(() => {
                    setDialog((prevState) => ({
                        ...prevState,
                        countdown: countdown / 10,
                    }));
                    countdown = countdown - 1;
                    if (countdown === 0) {
                        clearInterval(countdownInterval);
                        handleRedirectToManagerPage();
                    }
                }, 100);
            } else {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'ERROR',
                    btnConfirm: 'Thử lại',
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

    const handleSubmitDeleteProduct = (e) => {
        e.preventDefault();
        handleDeleteProduct(productData);
    };

    const handleOpenDeleteDialog = () => {
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
            onDelete: handleSubmitDeleteProduct,
        }));
    };

    const handleCloseDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: false,
        }));
    };

    const handleRedirectToManagerPage = () => {
        navigate('/dashboard/product');
    };

    const handleRedirectToUpdate = () => {
        navigate(`/dashboard/product/update/${id}`);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const contents = [
        {
            layout: 'header',
            items: [
                {
                    key: 'name',
                    label: 'Tên sản phẩm',
                },
                {
                    key: 'price',
                    label: 'Giá bán',
                    type: 'currency',
                },
            ],
        },
        {
            layout: 'body',
            items: [
                {
                    key: 'brand',
                    label: 'Thương hiệu',
                },
                {
                    key: 'category',
                    label: 'Danh mục',
                },
                {
                    key: 'material',
                    label: 'Chất liệu',
                },
                {
                    key: 'color',
                    label: 'Màu sắc',
                },
                {
                    key: 'quantity',
                    label: 'Tổng số',
                },
                {
                    key: 'sold',
                    label: 'Đã bán',
                },
            ],
        },
        {
            layout: 'footer',
            items: [
                {
                    key: 'description',
                    label: 'Mô tả sản phẩm',
                },
            ],
        },
    ];

    return (
        <div className="my-10 flex flex-col gap-12">
            <Typography variant="h4">Chi tiết sản phẩm</Typography>

            <Card>
                <CardBody className="p-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="row-span-2">
                            {isLoading || _.isEmpty(displayImages) ? (
                                <div className="h-full w-full animate-pulse rounded-md bg-blue-gray-200 pt-[125%]"></div>
                            ) : (
                                <Carousel
                                    className="rounded-md shadow"
                                    navigation={({ setActiveIndex, activeIndex, length }) => (
                                        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                                            {new Array(length).fill('').map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`block h-1 cursor-pointer shadow-all rounded-2xl transition-all content-[''] ${
                                                        activeIndex === i
                                                            ? 'w-8 bg-white'
                                                            : 'w-4 bg-white/50'
                                                    }`}
                                                    onClick={() => setActiveIndex(i)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                >
                                    {displayImages.map((image) => (
                                        <img
                                            key={image.id || image.public_id || image.secure_url}
                                            src={image.secure_url}
                                            alt={image.public_id}
                                            className="h-full w-full object-cover"
                                        />
                                    ))}
                                </Carousel>
                            )}
                        </div>

                        {contents.map(({ layout, items }) =>
                            layout === 'header' ? (
                                <div key={layout} className="grid lg:col-span-2">
                                    {items.map((item) =>
                                        item.type === 'currency' ? (
                                            <CustomCurrencyDisplay
                                                key={item.key}
                                                value={productData[item.key]}
                                                className="text-lg font-medium text-red-600"
                                            />
                                        ) : (
                                            <Typography
                                                key={item.key}
                                                className="text-2xl font-semibold"
                                            >
                                                {productData[item.key] || ''}
                                            </Typography>
                                        ),
                                    )}
                                </div>
                            ) : layout === 'body' ? (
                                <div
                                    key={layout}
                                    className="mt-auto grid grid-cols-2 gap-4 pt-4 lg:col-span-2 lg:grid-cols-3"
                                >
                                    {items.map((item) => (
                                        <ProductDetailsItem
                                            key={item.key}
                                            label={item.label}
                                            content={
                                                item.key === 'category'
                                                    ? productData.category_name || productData.category
                                                    : item.key === 'material'
                                                      ? productData.material_name || productData.material
                                                      : productData[item.key]
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div
                                    key={layout}
                                    className="border-t border-gray-200 pt-3 md:col-span-2 lg:col-span-3"
                                >
                                    {items.map((item) =>
                                        item.key === 'description' ? (
                                            <div
                                                key={item.key}
                                                className="description text-sm"
                                                dangerouslySetInnerHTML={{
                                                    __html: productData[item.key],
                                                }}
                                            />
                                        ) : (
                                            <Typography key={item.key} className="text-sm">
                                                {productData[item.key] || ''}
                                            </Typography>
                                        ),
                                    )}
                                </div>
                            ),
                        )}
                    </div>
                </CardBody>

                <CardFooter>
                    <CustomCrudGroupButtons
                        btnConfirn={{
                            text: 'Cập nhật',
                            onClick: handleRedirectToUpdate,
                        }}
                        btnDelete={{
                            text: 'Xóa',
                            onClick: handleOpenDeleteDialog,
                        }}
                        btnCancel={{
                            text: 'Trở về',
                            onClick: handleCancel,
                        }}
                    />
                </CardFooter>
            </Card>

            <CustomConfirmDialog {...dialog} />
        </div>
    );
}

export default ProductDetails;

const ProductDetailsItem = ({ label = 'label', content = 'content', loading }) => (
    <div className="container rounded-lg bg-gray-200 p-3">
        {loading ? (
            <>
                <Typography className="mb-3 animate-pulse bg-blue-gray-600 text-xs text-transparent">
                    1
                </Typography>
                <Typography className="animate-pulse  bg-blue-gray-300 text-sm text-transparent">
                    2
                </Typography>
            </>
        ) : (
            <>
                <Typography className="mb-3 text-xs font-semibold">{label}</Typography>
                <Typography className="text-sm font-normal capitalize text-blue-gray-500">
                    {content}
                </Typography>
            </>
        )}
    </div>
);
