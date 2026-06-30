import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Tooltip,
    Typography,
} from '@material-tailwind/react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export function CustomBlogCard({ data }) {
    const { img, title, description, tag, route, members } = data;
    return (
        <Card color="transparent" shadow={false}>
            <CardHeader floated={false} color="gray" className="mx-0 mt-0 mb-4 h-64 xl:h-40">
                <img src={img} alt={title} className="h-full w-full object-cover" />
            </CardHeader>
            <CardBody className="py-0 px-1">
                <Typography variant="small" className="font-normal text-blue-gray-500">
                    {tag}
                </Typography>
                <Typography variant="h5" color="blue-gray" className="mt-1 mb-2">
                    {title}
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-500">
                    {description}
                </Typography>
            </CardBody>
            <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                <Link to={route}>
                    <Button variant="outlined" size="sm">
                        view project
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

CustomBlogCard.defaultProps = {
    //
};

CustomBlogCard.propTypes = {
    data: PropTypes.object,
    onPreview: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
};

export default CustomBlogCard;
