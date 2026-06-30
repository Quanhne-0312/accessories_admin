import { Auth, Dashboard } from '@/layouts';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { logout, refreshTokens } from './redux/actions/userAction';

function ScrollToTop() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [pathname, search]);

    return null;
}

function App() {
    const dispatch = useDispatch();
    const isLogged = useSelector((state) => state.user.isLogged);
    const accessToken = useSelector((state) => state.user.accessToken);
    const refreshToken = useSelector((state) => state.user.refreshToken);

    useEffect(() => {
        const handleStoredSession = async () => {
            if (!isLogged) return;

            if (!refreshToken) {
                dispatch(logout());
                return;
            }

            if (!accessToken) {
                try {
                    await dispatch(refreshTokens());
                } catch (error) {
                    console.log(error);
                    dispatch(logout());
                }
            }
        };

        handleStoredSession();
    }, [accessToken, dispatch, isLogged, refreshToken]);

    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/auth/*" element={<Auth />} />
                {isLogged ? (
                    <>
                        <Route path="/dashboard/*" element={<Dashboard />} />
                        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/auth/login" replace />} />
                )}
            </Routes>
        </>
    );
}

export default App;
