import {
    USER_INFO, ERROR, 
} from "./type";

const initialState = {
    loggedUser:null,
    errorMessage: null,
    
};

export const userReducer = (
    state = initialState,
    { type, payload }
) => {
    switch (type) {
        case USER_INFO:
            return  { ...state, loggedUser: payload };
        case ERROR:
            return  { ...state, errorMessage: payload };
        default:
            return state;
    }
};
