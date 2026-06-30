import { productService } from '@/services';
import { CustomEditor, CustomSelectOption } from '@/widgets/partials';
import { Input } from '@material-tailwind/react';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

function CustomProductEditorForm({ data, onChange }) {
    const [isLoading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [colors, setColors] = useState([]);

    const handleGetProductOptions = useCallback(async () => {
        if (isLoading) return;

        setLoading(true);
        const [categoriesResponse, materialsResponse, colorsResponse] = await Promise.all([
            productService.getCategoriesService(),
            productService.getMaterialsService(),
            productService.getColorsService(),
        ]);

        if (categoriesResponse?.code === 'SUCCESS') {
            setCategories(categoriesResponse.result || []);
        }

        if (materialsResponse?.code === 'SUCCESS') {
            setMaterials(materialsResponse.result || []);
        }

        if (colorsResponse?.code === 'SUCCESS') {
            setColors(colorsResponse.result || []);
        }

        setLoading(false);
    }, [isLoading]);

    useEffect(() => {
        handleGetProductOptions();
    }, []);

    return (
        <form action="#" className="grid gap-4">
            <div className="grid gap-4 md:col-span-2">
                <Input
                    size="lg"
                    color="blue"
                    label="Tên sản phẩm"
                    required
                    value={data.name || ''}
                    onChange={(e) => onChange('name', e.target.value)}
                />
                <Input
                    size="lg"
                    color="blue"
                    label="Slug"
                    required
                    value={data.slug || ''}
                    onChange={(e) => onChange('slug', e.target.value)}
                    readOnly
                />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:col-span-2 md:grid-cols-3">
                <Input
                    size="lg"
                    color="blue"
                    label="Giá bán"
                    type="number"
                    required
                    value={data.price || ''}
                    onChange={(e) => onChange('price', e.target.value)}
                />
                <Input
                    size="lg"
                    color="blue"
                    label="Thương hiệu"
                    required
                    value={data.brand || ''}
                    onChange={(e) => onChange('brand', e.target.value)}
                />
                <CustomSelectOption
                    options={categories}
                    variant={{
                        label: 'Danh mục',
                        required: true,
                    }}
                    value={data.category || ''}
                    loading={isLoading && _.isEmpty(categories)}
                    onOpen={handleGetProductOptions}
                    onSelect={(value) => onChange('category', value)}
                />
                <CustomSelectOption
                    options={materials}
                    variant={{
                        label: 'Chất liệu',
                        required: true,
                    }}
                    value={data.material || ''}
                    loading={isLoading && _.isEmpty(materials)}
                    onOpen={handleGetProductOptions}
                    onSelect={(value) => onChange('material', value)}
                />
                <CustomSelectOption
                    options={colors}
                    variant={{
                        label: 'Màu sắc',
                        required: true,
                    }}
                    value={data.color || ''}
                    loading={isLoading && _.isEmpty(colors)}
                    onOpen={handleGetProductOptions}
                    onSelect={(value) => onChange('color', value)}
                />
                <Input
                    size="lg"
                    color="blue"
                    label="Số lượng"
                    type="number"
                    required
                    value={data.quantity || ''}
                    onChange={(e) => onChange('quantity', e.target.value)}
                />
            </div>
            <div className="grid md:col-span-2">
                <CustomEditor value={data.description} onChange={(value) => onChange('description', value)} />
            </div>
        </form>
    );
}

export default CustomProductEditorForm;
