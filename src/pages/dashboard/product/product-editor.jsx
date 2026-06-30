import { imageService, productService } from '@/services';
import CustomProductEditorForm from '@/widgets/forms/custom-product-editor-form';
import { CustomConfirmDialog, CustomCrudGroupButtons, CustomImageUpload } from '@/widgets/partials';
import {
    Card,
    CardBody,
    CardFooter,
    Tab,
    TabPanel,
    Tabs,
    TabsBody,
    TabsHeader,
    Typography,
} from '@material-tailwind/react';
import _ from 'lodash';
import { memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function ProductEditor() {
    const [activeTab, setActiveTab] = useState('general');
    const [updatable, setUpdatable] = useState(false);
    const [productData, setProductData] = useState({});
    const [defaultData, setDefaultData] = useState({});
    const [images, setImages] = useState([]);
    const [defaultImages, setDefaultImages] = useState([]);
    const [dialog, setDialog] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const tabsMenu = [
        {
            value: 'general',
            title: 'Tổng quan',
        },
        {
            value: 'images',
            title: 'Hình ảnh',
        },
        {
            value: 'variants',
            title: 'Tùy chọn',
        },
    ];

    useEffect(() => {
        const handleGetProductById = async (id) => {
            const response = await productService.getProductByIdService(id);

            if (response && response.code === 'SUCCESS') {
                const { images: responseImages = [], category_name, material_name, ...product } = response.result;
                const displayImages = !_.isEmpty(responseImages)
                    ? responseImages
                    : product.feature_image_url
                      ? [
                            {
                                public_id: `${product.slug || product.id}-feature`,
                                secure_url: product.feature_image_url,
                                isFallback: true,
                            },
                        ]
                      : [];
                const normalizedProduct = {
                    ...product,
                    category: category_name || product.category,
                    material: material_name || product.material,
                };

                setImages(displayImages);
                setDefaultImages(displayImages);
                setDefaultData(normalizedProduct);
                setProductData(normalizedProduct);
            }
        };
        if (id) {
            handleGetProductById(id);
        }
    }, [id]);

    useEffect(() => {
        if (_.isEqual(productData, defaultData) && _.isEqual(images, defaultImages)) {
            setUpdatable(false);
        } else {
            setUpdatable(true);
        }

        return () => setUpdatable(false);
    }, [productData, defaultData, images, defaultImages]);

    useEffect(() => {
        const handleBeforeUnload = async (event) => {
            event.preventDefault();
            event.returnValue = '';
            await handleCloudinaryUploadRollback(images);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const isCreatable = () => {
        const {
            name,
            slug,
            price,
            brand,
            category,
            material,
            color,
            quantity,
            feature_image_url,
            description,
        } = productData;

        if (
            !_.isEmpty(name) ||
            !_.isEmpty(slug) ||
            !_.isEmpty(price) ||
            !_.isEmpty(brand) ||
            !_.isEmpty(category) ||
            !_.isEmpty(material) ||
            !_.isEmpty(color) ||
            !_.isEmpty(quantity) ||
            !_.isEmpty(feature_image_url) ||
            !_.isEmpty(description) ||
            !_.isEmpty(images)
        ) {
            return true;
        }
        return false;
    };

    /** DATA SUBMIT HANDLER */

    const handleCreateProduct = async (data) => {
        try {
            setDialog((prevState) => ({
                ...prevState,
                status: 'PENDING',
                text: 'Đang xử lý thông tin...',
            }));

            const response = await new Promise((resolve) => {
                setTimeout(async () => {
                    const result = await productService.createProductService(data);
                    resolve(result);
                }, 1000);
            });

            if (response && response.code === 'SUCCESS') {
                handleResetData();

                setDialog((prevState) => ({
                    ...prevState,
                    status: 'SUCCESS',
                    text: `Tạo mới sản phẩm thành công!`,
                    btnCancel: 'Tạo thêm sản phẩm',
                    btnConfirm: 'Đến trang quản lý',
                    onConfirm: handleRedirectToManagerPage,
                }));
            } else {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'ERROR',
                    text: response?.message || 'Tạo mới sản phẩm không thành công!',
                    btnConfirm: 'Thử lại',
                }));
            }
        } catch (error) {
            setDialog((prevState) => ({
                ...prevState,
                status: 'ERROR',
                btnConfirm: 'Thử lại',
                text: error?.message || error || 'Tạo mới sản phẩm không thành công!',
            }));
        }
    };

    const handleUpdateProduct = async (data) => {
        try {
            setDialog((prevState) => ({
                ...prevState,
                status: 'PENDING',
                text: 'Đang xử lý thông tin...',
            }));

            const response = await new Promise((resolve) => {
                setTimeout(async () => {
                    const result = await productService.updateProductService(data);
                    resolve(result);
                }, 1000);
            });

            if (response && response.code === 'SUCCESS') {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'SUCCESS',
                    text: `Cập nhật thông tin thành công!`,
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
                        navigate(-1);
                    }
                }, 100);
            } else {
                setDialog((prevState) => ({
                    ...prevState,
                    status: 'ERROR',
                    btnConfirm: 'Thử lại',
                    text: response?.message || 'Cập nhật thông tin không thành công!',
                }));
            }
        } catch (error) {
            setDialog((prevState) => ({
                ...prevState,
                status: 'ERROR',
                btnConfirm: 'Thử lại',
                text: error?.message || error || 'Cập nhật thông tin không thành công!',
            }));
        }
    };

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
                    text: response?.message || 'Xóa sản phẩm không thành công!',
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

    const handleCloudinaryUploadRollback = async (images) => {
        const rollbackImages = images.filter((image) => !image.isFallback && image.public_id);

        if (_.isEmpty(rollbackImages)) {
            return true;
        }

        const response = await imageService.rollbackCloudUpload(rollbackImages);

        if (response && response.code === 'SUCCESS') {
            return true;
        }

        return false;
    };

    /** EVENT HANDLER */

    /** 1. onChange */

    const genarateSlug = (str) => {
        return str
            .toLowerCase()
            .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
            .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
            .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
            .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
            .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
            .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
            .replace(/đ/gi, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .trim();
    };

    const handleOnChange = (key, value) => {
        if (key === 'name') {
            const slug = genarateSlug(value);
            setProductData((prevState) => ({
                ...prevState,
                name: value,
                slug: slug,
            }));
            return;
        }

        setProductData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleOnChangeImages = (images) => {
        setImages(images);
    };

    /** 2. Submit */

    const handleSubmitCreateProduct = (e) => {
        e.preventDefault();
        const uploadedImages = images.filter((image) => !image.isFallback);
        handleCreateProduct({
            ...productData,
            description: productData.description || '',
            feature_image_url: productData.feature_image_url || uploadedImages[0]?.secure_url || '',
            images: uploadedImages,
        });
    };

    const handleSubmitUpdateProduct = (e) => {
        e.preventDefault();
        const uploadedImages = images.filter((image) => !image.isFallback);
        handleUpdateProduct({
            ...productData,
            description: productData.description || '',
            feature_image_url: productData.feature_image_url || uploadedImages[0]?.secure_url || '',
            images: uploadedImages,
        });
    };

    const handleSubmitDeleteProduct = (e) => {
        e.preventDefault();
        handleDeleteProduct(productData);
    };

    /** 3. Active dialog */

    const handleOpenCreateDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: true,
            status: 'READY',
            title: 'Tạo mới sản phẩm',
            text: 'Xác nhận tạo mới sản phẩm?',
            handler: handleCloseDialog,
            btnCancel: 'Hủy',
            onCancel: handleCloseDialog,
            btnConfirm: 'Tạo mới',
            onConfirm: handleSubmitCreateProduct,
        }));
    };

    const handleOpenUpdateDialog = () => {
        setDialog((prevState) => ({
            ...prevState,
            open: true,
            status: 'READY',
            title: 'Cập nhật sản phẩm',
            text: 'Xác nhận cập nhật sản phẩm?',
            handler: handleCloseDialog,
            btnCancel: 'Hủy',
            onCancel: handleCloseDialog,
            btnConfirm: 'Cập nhật',
            onConfirm: handleSubmitUpdateProduct,
        }));
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

    /** 4. Other */

    const handleRedirectToManagerPage = () => {
        navigate('/dashboard/product');
    };

    const handleCancel = async () => {
        const result = await handleCloudinaryUploadRollback(images);
        if (result) {
            navigate(-1);
        }
    };

    const handleResetData = () => {
        setActiveTab('general');
        setProductData({});
        setDefaultData({});
        setImages([]);
        setDefaultImages([]);
    };

    return (
        <div className="my-10 flex flex-col gap-12">
            <Typography variant="h4">
                {id ? 'Cập nhật thông tin sản phẩm' : 'Thêm sản phẩm mới'}
            </Typography>

            <Card>
                <CardBody className="p-4">
                    <Tabs value={activeTab}>
                        <TabsHeader
                            className="rounded-none border-b border-blue-gray-100 bg-transparent p-0 lg:justify-start"
                            indicatorProps={{
                                className:
                                    'bg-transparent border-b-2 border-gray-900 shadow-none rounded-none',
                            }}
                        >
                            {tabsMenu.map(({ value, title }) => (
                                <Tab
                                    key={value}
                                    value={value}
                                    onClick={() => setActiveTab(value)}
                                    className="whitespace-nowrap p-3 text-sm text-blue-gray-500 lg:w-max lg:py-2"
                                >
                                    {title}
                                </Tab>
                            ))}
                        </TabsHeader>

                        <TabsBody>
                            <TabPanel className="min-h-max px-0" key={'general'} value={'general'}>
                                <CustomProductEditorForm
                                    data={productData}
                                    onChange={handleOnChange}
                                />
                            </TabPanel>

                            <TabPanel className="min-h-max px-0" key={'images'} value={'images'}>
                                <CustomImageUpload
                                    images={images}
                                    feature={productData.feature_image_url}
                                    onChangeImages={(value) => handleOnChangeImages(value)}
                                    onChangeFeature={(value) =>
                                        handleOnChange('feature_image_url', value)
                                    }
                                />
                            </TabPanel>

                            <TabPanel
                                className="min-h-max px-0"
                                key={'variants'}
                                value={'variants'}
                            >
                                <div className="flex h-full w-full flex-col items-center justify-center gap-2 py-6 text-gray-500">
                                    <Typography className="text-sm font-medium">
                                        Không khả dụng bây giờ!
                                    </Typography>
                                    <Typography className="text-xs">
                                        Chức năng đang được cập nhật.
                                    </Typography>
                                </div>
                            </TabPanel>
                        </TabsBody>
                    </Tabs>
                </CardBody>
                <CardFooter className="p-4">
                    {id ? (
                        <CustomCrudGroupButtons
                            btnConfirn={{
                                text: 'Cập nhật',
                                disabled: !updatable,
                                onClick: handleOpenUpdateDialog,
                            }}
                            btnDelete={{
                                text: 'Xóa',
                                onClick: handleOpenDeleteDialog,
                            }}
                            btnCancel={{
                                text: 'Hủy',
                                onClick: handleCancel,
                            }}
                        />
                    ) : (
                        <CustomCrudGroupButtons
                            btnConfirn={{
                                text: 'Tạo mới',
                                disabled: !updatable,
                                onClick: handleOpenCreateDialog,
                            }}
                            btnCancel={{
                                text: 'Hủy',
                                onClick: handleCancel,
                            }}
                        />
                    )}
                </CardFooter>
            </Card>

            <CustomConfirmDialog {...dialog} />
        </div>
    );
}

export default memo(ProductEditor);
