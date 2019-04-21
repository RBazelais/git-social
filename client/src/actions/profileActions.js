import axios from 'axios';
import { GET_PROFILE, GET_LOADING, GET_ERRORS, PROFILE_LOADING } from './types';

// GET Current Profile
export const getCurrentProfile = () =>  dispatch => {
    //set loading state before the request
    dispatch(setProfileLoading());
    axios.get('/api/profile')
        .then(res => 
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch({
                type: GET_PROFILE, // return an emtpy object, show user btn to create a profile
                payload: {}
            })
        );
}

// SET profile loading
export const setProfileLoading = () => dispatch => {
    return {
        type: PROFILE_LOADING
    }
}