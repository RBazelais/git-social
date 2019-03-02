import axios from 'axios';
// set default header from axios
// don't need to manually have token for each request

const setAuthToken = token => {
    if(token){
        // Apply to every request 
        axios.defaults.headers.common['Authorization'] = token;
    }else {
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
    }
};

export default setAuthToken;