import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


// take from the component and get any other parameters that are passed in
const PrivateRoute = ({ 
    component: Component, 
    auth: { isAuthenticated, loading }, 
    ...rest
}) => (
    // pass in custom props
    <Route 
        { ...rest } 
        render = { props => 
        !isAuthenticated && !loading ? (
            <Redirect to='/login' />
        ) : (
            <Component{...props} />
        )
    } />
)

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,

});

export default connect(mapStateToProps)(PrivateRoute);
