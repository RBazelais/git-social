import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';  
import { registerUser } from '../../actions/authActions'; 
import TextFieldGroup from '../common/TextFieldGroup';


class Register extends Component {
	// Each field has to have its own component state
	constructor() {
		super();
		this.state ={
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			errors: {}
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount(){
		if(this.props.auth.isAuthenticated){
			this.props.history.push('/dashboard');
		}
	}
	
	componentWillReceiveProps(nextProps) {
		// test if errors will recieve props
		if(nextProps.errors){
			this.setState({ errors: nextProps.errors });
		}
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit(e) {
		e.preventDefault();
		const newUser = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword
		};
		// use this.props.history to redirect from within this action
		this.props.registerUser(newUser, this.props.history);
	}
	render() {
		const { errors } = this.state;
		const { user } = this.props.auth;
		return (
			<div className="register">
			{ user ? user.name : null }
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Sign Up</h1>
							<p className="lead text-center">Create your Git Social account</p>
							<form noValidate onSubmit={ this.onSubmit }>
								<TextFieldGroup 
									placeholder="Name"
									name="name"
									// type defaults to text
									value={this.state.name}
									onChange={this.onChange}
									error={errors.name}
								/>
								<TextFieldGroup 
									placeholder="Email Address"
									name="email"
									type="email"
									value={this.state.email}
									onChange={this.onChange}
									error={errors.email}
									info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
								/>
								<TextFieldGroup 
									placeholder="Password"
									name="password"
									type="password"
									value={this.state.password}
									onChange={this.onChange}
									error={errors.password}
								/>
								<TextFieldGroup 
									placeholder="Confirm Password"
									name="confirmPassword"
									type="password"
									value={this.state.confirmPassword}
									onChange={this.onChange}
									error={errors.confirmPassword}
								/>
								<input type="submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

// Define propTypes
Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProp, { registerUser })(withRouter( Register ));