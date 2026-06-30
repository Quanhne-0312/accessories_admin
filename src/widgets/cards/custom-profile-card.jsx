import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, Typography } from '@material-tailwind/react';

export function ProfileInfoCard({ data, action }) {
    const details = [
        {
            title: 'Số diện thoại',
            key: 'phone_number',
        },
        {
            title: 'Email',
            key: 'email',
        },
        {
            title: 'Địa chỉ',
            key: 'address',
        },
        {
            title: 'Liên kết',
            key: 'social_media',
        },
    ];

    return (
        <Card color="transparent" shadow={false}>
            <CardHeader
                color="transparent"
                shadow={false}
                floated={false}
                className="m-0 flex items-end justify-between gap-4 rounded-none"
            >
                <Typography variant="h5" color="blue-gray">
                    Hồ sơ
                </Typography>
                {action}
            </CardHeader>
            <CardBody className="grid gap-6 px-0">
                <hr className="border-blue-gray-100" />

                <ul className="flex flex-col gap-6 p-0">
                    {details.map((item) => (
                        <li key={item.key} className="flex items-start gap-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="whitespace-nowrap font-semibold"
                            >
                                {item.title}:
                            </Typography>

                            {item.key === 'social_media' ? (
                                <div className="flex items-center gap-4 text-xl">
                                    <i className="fa-brands fa-facebook text-blue-700" />
                                    <i className="fa-brands fa-twitter text-blue-400" />
                                    <i className="fa-brands fa-instagram text-purple-500" />
                                </div>
                            ) : (
                                <Typography variant="small" className="font-normal">
                                    {data?.[item.key] ?? ''}
                                </Typography>
                            )}
                        </li>
                    ))}
                </ul>

                <hr className="border-blue-gray-100" />

                {data?.bio ? (
                    <div
                        className="description text-sm"
                        dangerouslySetInnerHTML={{ __html: data?.bio }}
                    />
                ) : (
                    <Typography className="description text-sm italic">
                        Chưa có thông tin giới thiệu bản thân
                    </Typography>
                )}
            </CardBody>
        </Card>
    );
}

ProfileInfoCard.defaultProps = {};

ProfileInfoCard.propTypes = {
    data: PropTypes.object,
    details: PropTypes.object,
};

ProfileInfoCard.displayName = '/src/widgets/cards/profile-info-card.jsx';

export default ProfileInfoCard;
