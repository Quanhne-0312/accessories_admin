import { authService } from '@/services';
import { UserActionTypes } from '../constants';

export const login = (data) => ({
    type: UserActionTypes.login,
    payload: {
        data: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    },
});

export const logout = () => ({
    type: UserActionTypes.logout,
});

export const mapTokens = (accessToken, refreshToken) => ({
    type: UserActionTypes.refresh,
    payload: {
        accessToken,
        refreshToken,
    },
});

export const refreshTokens = () => async (dispatch) => {
    const response = await authService.refreshTokensService();
    if (!response?.accessToken || !response?.refreshToken) {
        dispatch(logout());
        throw new Error(response?.message || 'Unable to refresh token');
    }
    dispatch(mapTokens(response.accessToken, response.refreshToken));
};

// PROFILE

export const updateProfile = (newProfile) => ({
    type: UserActionTypes.ProfileUpdate,
    payload: newProfile,
});
