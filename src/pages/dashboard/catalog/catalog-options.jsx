import { productService } from '@/services';
import {
    Button,
    Card,
    CardBody,
    Chip,
    IconButton,
    Input,
    Tab,
    Tabs,
    TabsHeader,
    Typography,
} from '@material-tailwind/react';
import { PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect, useMemo, useState } from 'react';

const optionTypes = [
    {
        value: 'category',
        label: 'Danh mục',
        getData: productService.getCategoriesService,
    },
    {
        value: 'material',
        label: 'Chất liệu',
        getData: productService.getMaterialsService,
    },
    {
        value: 'color',
        label: 'Màu sắc',
        getData: productService.getColorsService,
    },
];

const slugify = (text) =>
    String(text)
        .replace(/\u0111/g, 'd')
        .replace(/\u0110/g, 'D')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

function CatalogOptions() {
    const [activeType, setActiveType] = useState('category');
    const [options, setOptions] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [editingOption, setEditingOption] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '' });
    const [message, setMessage] = useState(null);

    const activeConfig = useMemo(
        () => optionTypes.find((item) => item.value === activeType) || optionTypes[0],
        [activeType],
    );

    const handleGetOptions = async () => {
        setLoading(true);
        const response = await activeConfig.getData();
        if (response?.code === 'SUCCESS') {
            setOptions(response.result || []);
        } else {
            setOptions([]);
            setMessage({
                type: 'error',
                text: response?.message || 'Không tải được dữ liệu.',
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        setEditingOption(null);
        setFormData({ name: '', slug: '' });
        setMessage(null);
        handleGetOptions();
    }, [activeType]);

    const handleChangeName = (value) => {
        setFormData({
            name: value,
            slug: slugify(value),
        });
    };

    const handleEdit = (option) => {
        setEditingOption(option);
        setFormData({
            name: option.name || '',
            slug: option.slug || '',
        });
        setMessage(null);
    };

    const handleCancelEdit = () => {
        setEditingOption(null);
        setFormData({ name: '', slug: '' });
        setMessage(null);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            setMessage({ type: 'error', text: 'Vui lòng nhập tên.' });
            return;
        }

        setLoading(true);
        const payload = {
            type: activeType,
            id: editingOption?.id,
            name: formData.name.trim(),
            slug: formData.slug.trim() || slugify(formData.name),
        };
        const response = editingOption
            ? await productService.updateCatalogOptionService(payload)
            : await productService.createCatalogOptionService(payload);

        if (response?.code === 'SUCCESS') {
            setMessage({
                type: 'success',
                text: editingOption ? 'Đã cập nhật thành công.' : 'Đã thêm mới thành công.',
            });
            setEditingOption(null);
            setFormData({ name: '', slug: '' });
            await handleGetOptions();
        } else {
            setMessage({
                type: 'error',
                text: response?.message || 'Thao tác không thành công.',
            });
        }
        setLoading(false);
    };

    const handleDelete = async (option) => {
        if (!window.confirm(`Xóa "${option.name}"?`)) {
            return;
        }

        setLoading(true);
        const response = await productService.deleteCatalogOptionService({
            type: activeType,
            id: option.id,
        });

        if (response?.code === 'SUCCESS') {
            setMessage({ type: 'success', text: 'Đã xóa thành công.' });
            await handleGetOptions();
        } else {
            setMessage({
                type: 'error',
                text:
                    response?.code === 'VALIDATION_ERROR'
                        ? 'Mục này đang được sản phẩm sử dụng nên chưa thể xóa.'
                        : response?.message || 'Xóa không thành công.',
            });
        }
        setLoading(false);
    };

    return (
        <div className="my-10 flex flex-col gap-6">
            <div>
                <Typography variant="h4">Quản lý danh mục, chất liệu, màu sắc</Typography>
                <Typography className="mt-1 text-sm text-blue-gray-500">
                    Các lựa chọn này sẽ được dùng trong form tạo và chỉnh sửa sản phẩm.
                </Typography>
            </div>

            <Card>
                <CardBody className="grid gap-6">
                    <Tabs value={activeType}>
                        <TabsHeader className="w-full max-w-xl">
                            {optionTypes.map((item) => (
                                <Tab key={item.value} value={item.value} onClick={() => setActiveType(item.value)}>
                                    {item.label}
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Tabs>

                    <div className="grid gap-3 rounded-lg border border-blue-gray-100 p-4 md:grid-cols-[1fr_1fr_auto]">
                        <Input
                            label={`Tên ${activeConfig.label.toLowerCase()}`}
                            color="blue"
                            value={formData.name}
                            onChange={(event) => handleChangeName(event.target.value)}
                        />
                        <Input
                            label="Slug"
                            color="blue"
                            value={formData.slug}
                            onChange={(event) =>
                                setFormData((prevState) => ({
                                    ...prevState,
                                    slug: slugify(event.target.value),
                                }))
                            }
                        />
                        <div className="flex gap-2">
                            <Button
                                color="blue"
                                className="flex items-center gap-2"
                                disabled={isLoading}
                                onClick={handleSubmit}
                            >
                                <PlusIcon className="h-4 w-4" />
                                {editingOption ? 'Cập nhật' : 'Thêm'}
                            </Button>
                            {editingOption && (
                                <IconButton variant="outlined" color="blue-gray" onClick={handleCancelEdit}>
                                    <XMarkIcon className="h-5 w-5" />
                                </IconButton>
                            )}
                        </div>
                    </div>

                    {message && (
                        <div
                            className={`rounded-lg px-4 py-3 text-sm font-medium ${
                                message.type === 'success'
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <div className="overflow-hidden rounded-lg border border-blue-gray-100">
                        <table className="w-full min-w-[640px] table-auto text-left">
                            <thead>
                                <tr className="bg-blue-gray-50">
                                    <th className="p-4 text-sm font-semibold text-blue-gray-700">Tên</th>
                                    <th className="p-4 text-sm font-semibold text-blue-gray-700">Slug</th>
                                    <th className="p-4 text-sm font-semibold text-blue-gray-700">Sản phẩm đang dùng</th>
                                    <th className="w-32 p-4 text-right text-sm font-semibold text-blue-gray-700">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {options.map((option) => (
                                    <tr key={option.id || option.slug} className="border-t border-blue-gray-50">
                                        <td className="p-4 text-sm font-medium text-blue-gray-900">{option.name}</td>
                                        <td className="p-4 text-sm text-blue-gray-500">{option.slug}</td>
                                        <td className="p-4">
                                            <Chip
                                                value={Number(option.product_count || 0)}
                                                className="w-max rounded-full bg-blue-gray-50 text-blue-gray-700"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <IconButton
                                                    size="sm"
                                                    variant="text"
                                                    color="blue"
                                                    onClick={() => handleEdit(option)}
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </IconButton>
                                                <IconButton
                                                    size="sm"
                                                    variant="text"
                                                    color="red"
                                                    disabled={Number(option.product_count || 0) > 0}
                                                    onClick={() => handleDelete(option)}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </IconButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {options.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-6 text-center text-sm text-blue-gray-500">
                                            {isLoading ? 'Đang tải dữ liệu...' : 'Không có dữ liệu'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default CatalogOptions;
