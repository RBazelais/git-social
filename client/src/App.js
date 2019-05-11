import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser } from './actions/authActions';
import { logoutUser } from './actions/authActions';

import { Provider } from 'react-redux'; // provides application with a store
import store from './Store';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';

import './App.css';

// Check every page request if the user is logged in
// Check for token for jwtToken
if(localStorage.jwtToken){
	// Set auth token header auth
	setAuthToken(localStorage.jwtToken);
	// Decode token and get user info and expiration
	const decoded = jwt_decode(localStorage.jwtToken);
	// Set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded));

	// Check for expired token
	const currentTime = Date.now() / 1000;
	if(decoded.exp < currentTime){
		// Logout user
		store.dispatch(logoutUser());
		// TODO: Clear current profile

		// Redirect to login
		window.location.href = '/login';
	}
}

/* NOTE: localStorage is temp setup
	Storing jwtToken in localStorage leaves our website open to XSS and CSRF attack.
	TODO: Find a safer way to store the token and protect api from being manipulated.
	ref: https://stackoverflow.com/questions/27067251/where-to-store-jwt-in-browser-how-to-protect-against-csrf
	ref: https://stackoverflow.com/questions/44133536/is-it-safe-to-store-a-jwt-in-localstorage-with-reactjs
	Do more research
*/

class App extends Component {
	render() {
		return (
			<Provider store={ store }> 
				<Router>
					<div className="App">
						<Navbar />
						<Route exact path="/" component={ Landing } />
						<div className="container">
							<Route exact path="/Register" component={ Register }/>
							<Route exact path="/Login" component={ Login }/>
							<Route exact path="/dashboard" component={ Dashboard }/>
						</div> 
						<Footer />
					</div>
				</Router>
			</Provider>
		);
	}
}

export default App;
