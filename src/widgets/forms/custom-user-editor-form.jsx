import { Avatar, Button, Input } from '@material-tailwind/react';
import PropTypes from 'prop-types';
import { AddressSelection, CustomEditor, CustomSelectOption, UserDetailsItem } from '../partials';
import CustomAvatarUpload from '../partials/custom-avatar-upload';
import { useEffect, useState } from 'react';
import { userService } from '@/services';
import { useSelector } from 'react-redux';

const passwordPattern = '(?=.*\\d)[A-Z].{6,}';
const passwordTitle = 'Mat khau phai tren 6 ky tu, viet hoa chu cai dau va co it nhat 1 so.';

export function CustomUserEditorForm({ data, isCreate, canEditRole, onChange }) {
    const [isLoading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const { role_id } = useSelector((state) => state.user.data);

    useEffect(() => {
        if (!canEditRole && !isCreate) {
            return;
        }

        const handleGetRoles = async () => {
            setLoading(true);
            const response = await userService.getRolesService(role_id);
            if (response && response.code === 'SUCCESS') {
                setRoles(response.result);
            }
            setLoading(false);
        };
        handleGetRoles();
    }, [canEditRole, isCreate, role_id]);

    /**EVENT HANDLER */
    const handleOnSelectRole = (value) => {
        const result = roles.find((item) => item.name === value);
        if (result && result.name !== data.role) {
            onChange('role', result.name);
            onChange('role_id', result.id);
        }
    };
    const handleOnChangeAddress = (key, value) => {
        switch (key) {
            case 'province':
                onChange('address', {
                    ...data.address,
                    province: value,
                    district: '',
                    ward: '',
                });
                break;
            case 'district':
                onChange('address', {
                    ...data.address,
                    district: value,
                    ward: '',
                });
                break;
            case 'ward':
                onChange('address', {
                    ...data.address,
                    ward: value,
                });
                break;
            default:
                onChange('address', {
                    ...data.address,
                    location: value,
                });
                break;
        }
    };

    const isReadOnlyField = (item) => {
        if (item.key === 'role') {
            return !canEditRole;
        }

        return item.readOnly && !isCreate ? true : false;
    };

    const contents = [
        {
            layout: 'header',
            items: [
                {
                    key: 'name',
                    type: 'text',
                    label: 'Họ tên',
                },
                {
                    key: 'role',
                    type: 'select',
                    label: 'Loại tài khoản',
                    options: roles,
                    onSelect: handleOnSelectRole,
                    readOnly: true,
                },
                {
                    key: 'birth',
                    type: 'date',
                    label: 'Ngày sinh',
                },
            ],
        },
        {
            layout: 'body',
            items: [
                {
                    key: 'phone_number',
                    type: 'tel',
                    label: 'Số điện thoại',
                    readOnly: true,
                },
                {
                    key: 'email',
                    type: 'email',
                    label: 'Email',
                },
                {
                    key: 'password',
                    type: 'password',
                    pattern: passwordPattern,
                    label: 'Mật khẩu',
                },
            ],
        },
    ];

    return (
        <div className="grid w-full gap-6 lg:grid-cols-3">
            <div className="row-span-2 grid place-items-center">
                <CustomAvatarUpload
                    avatar={data?.avatar}
                    readOnly={false}
                    onChangeAvatar={(value) => onChange('avatar', value)}
                />
            </div>
            {contents.map(({ layout, items }, index) =>
                layout === 'header' ? (
                    <div key={index} className="grid gap-6 lg:col-span-2">
                        {items.map((item) =>
                            item.type === 'select' ? (
                                <CustomSelectOption
                                    key={item.key}
                                    options={isLoading ? [] : item?.options}
                                    variant={{ label: item.label }}
                                    value={data[item.key] ?? ''}
                                    onSelect={(value) => item.onSelect(value)}
                                    readOnly={isReadOnlyField(item)}
                                />
                            ) : (
                                <Input
                                    key={item.key}
                                    size="lg"
                                    color="blue"
                                    type={item.type}
                                    label={item.label}
                                    pattern={item.pattern ?? null}
                                    title={item.type === 'password' ? passwordTitle : undefined}
                                    value={data[item.key] ?? ''}
                                    onChange={(e) => onChange(item.key, e.target.value)}
                                    readOnly={isReadOnlyField(item)}
                                />
                            ),
                        )}
                    </div>
                ) : (
                    <div key={index} className="grid gap-6 lg:col-span-2">
                        {items.map((item) => (
                            <div key={item.key} className="flex items-end justify-between gap-2">
                                {item.readOnly && !isCreate ? (
                                    <>
                                        <UserDetailsItem
                                            label={item.label}
                                            text={data[item.key] ? data[item.key] : 'unknown'}
                                            encrypt={item.key}
                                        />
                                        <Button
                                            size="sm"
                                            color="blue"
                                            variant="text"
                                            className="whitespace-nowrap px-2"
                                        >
                                            Chỉnh sửa
                                        </Button>
                                    </>
                                ) : (
                                    <Input
                                        key={item.key}
                                        size="lg"
                                        color="blue"
                                        type={item.type}
                                        label={item.label}
                                        pattern={item.pattern ?? null}
                                        title={item.type === 'password' ? passwordTitle : undefined}
                                        value={data[item.key] ?? ''}
                                        onChange={(e) => onChange(item.key, e.target.value)}
                                        readOnly={isReadOnlyField(item)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ),
            )}
            <div className="grid gap-6 lg:col-span-3">
                <AddressSelection address={data?.address} onChange={handleOnChangeAddress} />

                <CustomEditor value={data?.bio} onChange={(value) => onChange('bio', value)} />
            </div>
        </div>
    );
}

CustomUserEditorForm.defaultProps = {};

CustomUserEditorForm.propTypes = {
    data: PropTypes.object,
    isCreate: PropTypes.bool,
    canEditRole: PropTypes.bool,
    onChange: PropTypes.func,
};

export default CustomUserEditorForm;
