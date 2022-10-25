import React from 'react';
import { IS_ADMIN, IS_LOGGED, LOGOUT } from './Action.type';

const Reducer = (state, action) => {
    switch(action.type) {
        case IS_LOGGED:
            return {...state, isLogged : true };
        case IS_ADMIN:
            return {...state, isAdmin : true};
        case LOGOUT:
            return {
                ...state,
                isLogged: false,
                isAdmin: false
            }
        default:
            return state;
    }
}

export default Reducer;
