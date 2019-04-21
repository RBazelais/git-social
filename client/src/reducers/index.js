// bring in all reducers
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import profileReducer from './profileReducer';
import errorReducer from './errorReducer';


export default combineReducers({
    auth: authReducer,
    profile: profileReducer,
    errors: errorReducer // this.props.errors to access
});