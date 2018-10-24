const initialState = {
    isAuthenticated: false,
    user: {}
};


export default function authReducer(state = initialState, action) {
    //dispatch actions to the reducer
    switch(action.type) {
        default:
            return state;
    }
}
