export const ADMIN_ROLES = {
    ADMINISTRATOR: 1,
    EMPLOYEE: 2,
    MANAGER: 4,
};

export const ROLE_PERMISSIONS = {
    [ADMIN_ROLES.ADMINISTRATOR]: ['dashboard:all'],
    [ADMIN_ROLES.MANAGER]: ['dashboard:all'],
    [ADMIN_ROLES.EMPLOYEE]: ['profile:read', 'profile:update', 'order:manage', 'product:manage'],
};

export const canAccess = (user, permissions = []) => {
    if (!permissions || permissions.length === 0) {
        return true;
    }

    const userPermissions = ROLE_PERMISSIONS[user?.role_id] || [];

    return (
        userPermissions.includes('dashboard:all') ||
        permissions.some((permission) => userPermissions.includes(permission))
    );
};

export const filterDashboardPages = (pages, user) =>
    pages.filter((page) => canAccess(user, page.permissions));
