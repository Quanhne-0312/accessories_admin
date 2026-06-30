import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Spinner } from '@material-tailwind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { memo, useEffect, useRef, useState } from 'react';

export function CustomSelectOption({
    type,
    variant,
    value,
    options,
    onSelect,
    disabled,
    readOnly,
    loading,
    onOpen,
}) {
    const [isOpen, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [data, setData] = useState([]);
    const [dropdownable, setDropdownable] = useState(true);

    const selectionRef = useRef(null);
    let posY = 0;

    useEffect(() => {
        const calculatePosY = () => {
            if (selectionRef.current) {
                const { top } = selectionRef.current.getBoundingClientRect();
                posY = window.scrollY + top;
                const distance = window.innerHeight - posY;
                if (distance < 240) {
                    setDropdownable(false);
                }
            }
        };

        calculatePosY();
        window.addEventListener('scroll', calculatePosY);

        return () => {
            window.removeEventListener('scroll', calculatePosY);
        };
    }, []);

    const handleOpen = () => {
        if (!isOpen && onOpen) {
            onOpen();
        }
        setOpen((prevIsOpen) => !prevIsOpen);
        setText('');
    };

    const handleSelect = (value) => {
        if (!isOpen) {
            document.addEventListener('click', handleOutsideClick, false);
        } else {
            document.removeEventListener('click', handleOutsideClick, false);
        }
        setOpen((prevIsOpen) => !prevIsOpen);
        onSelect(value);
    };

    const handleOutsideClick = () => {
        handleSelect();
    };

    useEffect(() => {
        setData(options);
    }, [options]);

    const handleOnChangeFilter = (e) => {
        const keyword = e.target.value;
        if (!_.isEmpty(keyword)) {
            const normalizedKeyword = keyword.toLowerCase();
            const filtered = options.filter((item) =>
                [item?.name, item?.name_with_type, item?.slug, item?.codename]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(normalizedKeyword)),
            );
            setText(keyword);
            setData(filtered);
        } else {
            setText(keyword);
            setData(options);
        }
    };

    const nothingHappen = () => {};

    return (
        <div className="w-full">
            <div className={`custom-select-option ${disabled ? 'select-none' : null} ${isOpen ? 'open' : null}`}>
                <div
                    className={`select ${value ? '!border-t-transparent' : null} `}
                    onClick={readOnly ? nothingHappen : handleOpen}
                >
                    <div className="absolute top-2/4 left-3 -translate-y-2/4 pt-0.5">
                        <span>{value}</span>
                    </div>

                    <label className={`label ${value || isOpen ? 'minimize' : 'text-sm leading-[4.1]'}`}>
                        {variant.label}
                        {variant.required && <span className={'ml-1 font-semibold text-red-400'}>*</span>}
                    </label>

                    <div
                        className={`absolute top-1/2 right-2 grid h-5 w-5 -translate-y-1/2 place-items-center pt-px transition-all duration-300 ${
                            isOpen ? '-rotate-180' : 'rotate-0'
                        }`}
                    >
                        <ChevronDownIcon className="h-4 w-4" />
                    </div>
                </div>

                {!disabled && (
                    <div
                        ref={selectionRef}
                        className={`absolute left-0 right-0 z-50 overflow-hidden rounded-md bg-white transition-all duration-300 focus:outline-none
                        ${dropdownable ? 'top-[calc(100%+5px)]' : 'bottom-[calc(100%+5px)]'} ${
                            isOpen
                                ? 'max-h-96 border border-blue-gray-100 shadow-lg shadow-blue-gray-500/10'
                                : 'max-h-0'
                        } `}
                    >
                        <div className="relative bg-gray-100 p-2">
                            <input
                                type={'text'}
                                value={text}
                                placeholder={'Tìm kiếm...'}
                                className="w-full rounded border border-blue-gray-100 py-1 px-2 text-sm font-medium text-blue-gray-500 outline-none placeholder:font-normal placeholder:italic"
                                onChange={(e) => handleOnChangeFilter(e)}
                            />
                        </div>

                        <ul className="options">
                            {loading ? (
                                <li>
                                    <div className="option-item flex items-center gap-2">
                                        <Spinner className="h-4 w-4" />
                                        <span>Đang tải dữ liệu...</span>
                                    </div>
                                </li>
                            ) : !_.isEmpty(data) ? (
                                data.map((item) => (
                                    <li
                                        key={item.name}
                                        className="option-item"
                                        onClick={() => handleSelect(item?.name_with_type || item.name)}
                                    >
                                        <span>{item?.name_with_type || item.name}</span>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <div className="option-item">
                                        <span>
                                            Không tìm thấy <strong>{text}</strong>
                                        </span>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

CustomSelectOption.propTypes = {
    type: PropTypes.string,
    variant: PropTypes.object,
    value: PropTypes.any,
    options: PropTypes.array,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    loading: PropTypes.bool,
    onOpen: PropTypes.func,
};

export default memo(CustomSelectOption);
