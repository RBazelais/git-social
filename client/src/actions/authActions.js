import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER} from "./types";

 // Register User
export const registerUser = (userData, history) => (dispatch) => {
    // fetch asynchronus data from back end
    axios.post('api/users/register', userData)
        // redirect and login for testing
        .then(res => history.push('/login'))
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        ); 
};

// Login - Get user token
export const loginUser = userData => (dispatch) => {
    axios
        .post('/api/users/login', userData)
        .then(res => {
            // save to localStorage 
            const { token } = res.data;
            // set token to localStorage 
            // NOTE: Only stores strings
            localStorage.setItem('jwtToken', token);
            // set token to Auth Header
            setAuthToken(token);

            // Set the user and extract from Bearer Token
            // Decode token to get user data
            const decoded = jwt_decode(token);

            // Set current user
            dispatch(setCurrentUser(decoded));

        })
        .catch( err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Set logged in user
export const setCurrentUser = (decoded) => {
    // Passes user and token information
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem('jwtToken');

    // Remove auth header for future requests
    setAuthToken(false);

    // Set current user to empty {} and set isAuthenticaed to false
    dispatch(setCurrentUser({}));
};

