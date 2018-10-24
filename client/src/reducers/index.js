// bring in all reducers
import { combineReducer, combineReducers } from 'redux';
import authReducer from './authReducer';

export default combineReducers({
    auth: authReducer 
});