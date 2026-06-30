import { login } from '@/redux/actions/userAction';
import { authService } from '@/services';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Input,
    Spinner,
    Typography,
} from '@material-tailwind/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleToggleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(null);
        handleLogin(username, password);
    };

    const handleLogin = async (username, password) => {
        try {
            setLoading(true);
            const response = await authService.loginService(username, password);

            if (response && response.code === 'SUCCESS') {
                const { result, accessToken, refreshToken } = response;
                dispatch(
                    login({
                        user: result,
                        accessToken,
                        refreshToken,
                    }),
                );
                navigate('/dashboard/home');
                return;
            }

            setMessage(response?.message || 'Đăng nhập không thành công.');
        } catch (error) {
            console.log(error);
            setMessage(error?.message || 'Đăng nhập không thành công.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid min-h-screen md:grid-cols-2">
            <img
                src="https://www.junie.vn/cdn/shop/files/NonSale_HP_Hero_5-16_5-23_Desktop.jpg?v=1684537968&width=3000"
                className="hidden h-full w-full object-cover object-left md:block"
            />
            <div className="grid w-full place-items-center">
                <Card className="shadow-none">
                    <form action="#" onSubmit={handleSubmit}>
                        <CardBody className="flex min-w-[320px] flex-col gap-4">
                            <Typography variant="h5" className="text-center">
                                Đăng nhập
                            </Typography>

                            {message && (
                                <Typography className="text-center text-sm font-medium text-red-600">
                                    {message}
                                </Typography>
                            )}

                            <Input
                                type="text"
                                label="Email hoặc SĐT"
                                size="lg"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                label="Mật khẩu"
                                size="lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                icon={
                                    <div
                                        className="cursor-pointer"
                                        onClick={handleToggleShowPassword}
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        )}
                                    </div>
                                }
                            />
                        </CardBody>
                        <CardFooter className="grid gap-4 pt-0">
                            <Button
                                variant="gradient"
                                fullWidth
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2"
                            >
                                {isLoading && <Spinner className="h-4 w-4" />}
                                Đăng nhập
                            </Button>
                            <Link>
                                <Typography
                                    color="blue"
                                    className="text-center text-sm font-medium"
                                >
                                    Quên mật khẩu?
                                </Typography>
                            </Link>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default Login;
