import axios from 'axios';
import { GET_ERRORS } from "./types";

export const registerUser = (userData, history) => (dispatch) => {
    // fetch asynchronus data from back end
    axios.post('api/users/register', userData)
        // redirect and log for testing
        .then(res => history.push('/login'))
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};


// add errors reducer
// Register user
// call request then redirect to the login page on success
// will go to a separate errors reducers