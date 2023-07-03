import { combineReducers } from "redux";
import { userReducer } from './User/reducer';
export const combinedReducers = combineReducers({
    user: userReducer,
});
