import{ createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {}; // no state for store
const middleware = [thunk];

const store = createStore(
    rootReducer, 
    initialState,
        compose(applyMiddleware(...middleware),
        // implement Redux devtools
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;