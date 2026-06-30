import { Chip, Rating, Typography } from '@material-tailwind/react';
import PropTypes from 'prop-types';
import { CustomCrudMenu, CustomCurrencyDisplay } from '../partials';
import { StarIcon } from '@heroicons/react/24/solid';

export function CustomProductCard({ data, onPreview, onUpdate, onDelete }) {
    return data ? (
        <div className="relative flex flex-wrap items-center gap-3 rounded-lg border border-blue-gray-100 p-3 shadow-lg md:flex-nowrap">
            <div className="relative grid w-full grid-cols-4 gap-2 text-blue-gray-500 md:grid-cols-12 md:gap-3">
                <div className="relative row-span-2 pt-[100%] md:col-span-1 md:row-span-1">
                    <div className="absolute inset-0 overflow-hidden rounded">
                        <img
                            src={data.feature_image_url}
                            alt={data.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>

                <div className="col-span-3 flex flex-col justify-center md:row-span-1">
                    <Typography className="text-base font-medium line-clamp-1">
                        {data.name}
                    </Typography>
                    <div className="flex">
                        <StarIcon className="h-4 w-4 text-yellow-700" />
                        <StarIcon className="h-4 w-4 text-yellow-700" />
                        <StarIcon className="h-4 w-4 text-yellow-700" />
                        <StarIcon className="h-4 w-4 text-yellow-700" />
                        <StarIcon className="h-4 w-4 text-yellow-700" />
                    </div>
                </div>

                <div className="col-span-3 flex flex-col justify-center md:col-span-2">
                    <Typography className="mb-1 text-xs line-clamp-1">Giá</Typography>
                    <CustomCurrencyDisplay
                        className="text-sm font-medium text-red-500"
                        value={data.price}
                    />
                </div>

                <div className="flex flex-col justify-center md:col-span-2">
                    <Typography className="mb-1 text-xs line-clamp-1">Phân loại</Typography>
                    <Typography className="text-sm font-medium line-clamp-1">
                        {data.category}
                    </Typography>
                </div>

                <div className="flex flex-col justify-center text-center">
                    <Typography className="mb-1 text-xs line-clamp-1">Tổng số</Typography>
                    <Typography className="text-sm font-medium">{data.quantity}</Typography>
                </div>

                <div className="flex flex-col justify-center text-center">
                    <Typography className="mb-1 text-xs line-clamp-1">Đã bán</Typography>
                    <Typography className="text-sm font-medium">{data.sold}</Typography>
                </div>

                <div className="flex flex-col items-center justify-center md:col-span-2">
                    <Typography className="mb-1 text-xs line-clamp-1">Trạng thái</Typography>
                    <Typography className="flex h-5 items-center gap-2">
                        <span className="relative h-2 w-2 rounded-full bg-green-500 shadow-all shadow-green-200 sm:-top-px"></span>
                        <span className="hidden whitespace-nowrap text-[10px] font-medium uppercase sm:block">
                            In Stock
                        </span>
                    </Typography>
                </div>
            </div>

            <div className="absolute top-1 right-1">
                <CustomCrudMenu
                    onPreview={() => onPreview(data.id)}
                    onUpdate={() => onUpdate(data.id)}
                    onDelete={() => onDelete(data)}
                />
            </div>
        </div>
    ) : (
        <CustomProductCardSkeleton />
    );
}

CustomProductCard.defaultProps = {
    //
};

CustomProductCard.propTypes = {
    data: PropTypes.object,
    onPreview: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
};

const CustomProductCardSkeleton = () => {
    const className1 =
        'mb-1 w-[calc(100%-20px)] animate-pulse rounded bg-blue-gray-200 text-[14px] text-transparent';
    const className2 = 'animate-pulse rounded bg-blue-gray-400 text-[10px] text-transparent';
    return (
        <div className="relative flex flex-wrap items-center gap-3 rounded-lg border border-blue-gray-100 p-3 shadow-lg md:flex-nowrap">
            <div className="relative grid w-full grid-cols-4 gap-2 text-blue-gray-500 md:grid-cols-12 md:gap-3">
                <div className="relative row-span-2 pt-[100%] md:col-span-1 md:row-span-1">
                    <div className="absolute inset-0 animate-pulse overflow-hidden rounded bg-blue-gray-200"></div>
                </div>

                <div className="col-span-3 flex flex-col justify-center md:row-span-1">
                    <Typography className={className1}>1</Typography>
                    <Typography className={className2}>2</Typography>
                </div>

                <div className="col-span-3 flex flex-col justify-center md:col-span-2">
                    <Typography className={className1}>1</Typography>
                    <Typography className={className2}>2</Typography>
                </div>

                <div className="col-span-3 flex flex-col justify-center md:col-span-2">
                    <Typography className={className1}>1</Typography>
                    <Typography className={className2}>2</Typography>
                </div>

                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex flex-col justify-center text-center">
                        <Typography className={className1}>1</Typography>
                        <Typography className={className2}>2</Typography>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomProductCard;
