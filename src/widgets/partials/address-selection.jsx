import { locationService } from '@/services';
import { Input } from '@material-tailwind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { CustomSelectOption } from '.';

export function AddressSelection({ address, onChange }) {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const safeAddress = address || {};

    const getLocationData = (response, key) => {
        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        if (Array.isArray(response?.[key])) {
            return response[key];
        }

        return [];
    };

    const handleGetProvinces = async () => {
        setLoading(true);
        const response = await locationService.getProvincesService();
        const data = getLocationData(response, 'provinces');
        if (!_.isEmpty(data)) {
            setProvinces(data);
            setError(null);
        } else {
            setError('province');
        }
        setLoading(false);
    };

    const handleGetDistricts = async (provinceCode) => {
        setLoading(true);
        const response = await locationService.getDistrictsService(provinceCode);
        const data = getLocationData(response, 'districts');
        if (!_.isEmpty(data)) {
            setDistricts(data);
            setError(null);
        } else {
            setError('district');
        }
        setLoading(false);
    };

    const handleGetWards = async (districtCode) => {
        setLoading(true);
        const response = await locationService.getWardsService(districtCode);
        const data = getLocationData(response, 'wards');
        if (!_.isEmpty(data)) {
            setWards(data);
            setError(null);
        } else {
            setError('ward');
        }
        setLoading(false);
    };

    useEffect(() => {
        handleGetProvinces();
    }, []);

    useEffect(() => {
        if (safeAddress.province) {
            const result = provinces.find(
                (item) =>
                    item?.name_with_type === safeAddress.province ||
                    item?.name === safeAddress.province,
            );
            if (result) {
                handleGetDistricts(result.code);
            } else {
                setDistricts([]);
            }
        }
    }, [safeAddress?.province, provinces]);

    useEffect(() => {
        if (safeAddress.district) {
            const result = districts.find(
                (item) =>
                    item?.name_with_type === safeAddress.district ||
                    item?.name === safeAddress.district,
            );
            if (result) {
                handleGetWards(result.code);
            } else {
                setWards([]);
            }
        }
    }, [safeAddress?.district, districts]);

    useEffect(() => {
        if (error) {
            if (error === 'province') {
                const timeout = setTimeout(() => {
                    handleGetProvinces();
                }, 10000);
                return () => clearTimeout(timeout);
            } else if (error === 'district') {
                const timeout = setTimeout(() => {
                    const result = provinces.find(
                        (item) =>
                            item?.name_with_type === safeAddress.province ||
                            item?.name === safeAddress.province,
                    );
                    if (result) {
                        handleGetDistricts(result.code);
                    }
                }, 10000);
                return () => clearTimeout(timeout);
            } else if (error === 'ward') {
                const timeout = setTimeout(() => {
                    const result = districts.find(
                        (item) =>
                            item?.name_with_type === safeAddress.district ||
                            item?.name === safeAddress.district,
                    );
                    if (result) {
                        handleGetWards(result.code);
                    }
                }, 10000);
                return () => clearTimeout(timeout);
            }
        }
    }, [error]);

    /** EVENT HANDLER */

    const handleProvinceChange = (value) => {
        const result = provinces.find(
            (item) => item?.name_with_type === value || item?.name === value,
        );
        const selectedValue = result?.name_with_type || result?.name;

        if (selectedValue && selectedValue !== safeAddress.province) {
            onChange('province', selectedValue);
            setDistricts([]);
            setWards([]);
            // get new children
            handleGetDistricts(result.code);
        }
    };

    const handleDistrictChange = (value) => {
        const result = districts.find(
            (item) => item?.name_with_type === value || item?.name === value,
        );
        const selectedValue = result?.name_with_type || result?.name;

        if (selectedValue && selectedValue !== safeAddress.district) {
            onChange('district', selectedValue);
            setWards([]);
            // get new children
            handleGetWards(result.code);
        }
    };

    const handleWardChange = (value) => {
        const result = wards.find((item) => item?.name_with_type === value || item?.name === value);
        const selectedValue = result?.name_with_type || result?.name;

        if (selectedValue && selectedValue !== safeAddress.ward) {
            onChange('ward', selectedValue);
        }
    };

    const handleAddressChange = (e) => {
        onChange('location', e.target.value);
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-4">
                <div className="min-w-[240px] w-full">
                    <CustomSelectOption
                        options={provinces}
                        variant={{
                            key: 'province',
                            label: 'Tỉnh/Thành phố TW',
                        }}
                        value={safeAddress?.province}
                        loading={isLoading && _.isEmpty(provinces)}
                        onSelect={handleProvinceChange}
                    />
                </div>
                <div className="min-w-[240px] w-full">
                    <CustomSelectOption
                        options={districts}
                        variant={{
                            key: 'district',
                            label: 'Huyện/Quận/TX/TP',
                        }}
                        value={safeAddress?.district}
                        loading={
                            isLoading && _.isEmpty(districts) && !_.isEmpty(safeAddress.province)
                        }
                        onSelect={handleDistrictChange}
                    />
                </div>
                <div className="min-w-[240px] w-full">
                    <CustomSelectOption
                        options={wards}
                        variant={{
                            key: 'ward',
                            label: 'Xã/Phường/Thị trấn',
                        }}
                        value={safeAddress?.ward}
                        loading={isLoading && _.isEmpty(wards) && !_.isEmpty(safeAddress.district)}
                        onSelect={handleWardChange}
                    />
                </div>
                <Input
                    size="lg"
                    color="blue"
                    label="Địa chỉ"
                    value={safeAddress?.location || ''}
                    onChange={handleAddressChange}
                    required
                />
            </div>
        </div>
    );
}

AddressSelection.propTypes = {
    address: PropTypes.object,
    onChange: PropTypes.func,
};

export default AddressSelection;
