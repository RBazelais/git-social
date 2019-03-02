// bring in all reducers
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';


export default combineReducers({
    auth: authReducer,
    errors: errorReducer // this.props.errors to access
});