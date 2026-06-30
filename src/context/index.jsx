import React from 'react';
import PropTypes from 'prop-types';

export const MaterialTailwind = React.createContext(null);
MaterialTailwind.displayName = 'MaterialTailwindContext';

export function reducer(state, action) {
    switch (action.type) {
        case 'OPEN_SIDENAV': {
            return { ...state, openSidenav: action.value };
        }
        case 'SIDENAV_DARKMODE': {
            return { ...state, darkmodeSidenav: action.value };
        }
        case 'OPEN_CONFIGURATOR': {
            return { ...state, openConfigurator: action.value };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

export function MaterialTailwindControllerProvider({ children }) {
    const initialState = {
        openSidenav: false,
        openConfigurator: false,
        darkmodeSidenav: false,
    };

    const [controller, dispatch] = React.useReducer(reducer, initialState);
    const value = React.useMemo(() => [controller, dispatch], [controller, dispatch]);

    return <MaterialTailwind.Provider value={value}>{children}</MaterialTailwind.Provider>;
}

export function useMaterialTailwindController() {
    const context = React.useContext(MaterialTailwind);

    if (!context) {
        throw new Error(
            'useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider.',
        );
    }

    return context;
}
MaterialTailwindControllerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const setOpenSidenav = (dispatch, value) => dispatch({ type: 'OPEN_SIDENAV', value });
export const setOpenConfigurator = (dispatch, value) =>
    dispatch({ type: 'OPEN_CONFIGURATOR', value });
export const setDarkmodeSidenav = (dispatch, value) =>
    dispatch({ type: 'SIDENAV_DARKMODE', value });
