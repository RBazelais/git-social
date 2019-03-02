import { GET_ERRORS } from "../actions/types";

const initialState = {};

export default function authReducer(state = initialState, action) {
    //dispatch actions to the reducer
    switch(action.type) {
        case GET_ERRORS :
            return action.payload;
        default:
            return state;
    }
}
 