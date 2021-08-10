const Validator = require('validator');
const isEmpty = require('./is-empty');

// NOTE: every thing validator receives must be a string
module.exports = function validateLoginInput(data){
    let errors = {};

    // if its not empty then do nothing, if not then it is an empty string
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(!Validator.isEmail(data.email)){
        errors.email = "Email is invalid";
    }

    if(Validator.isEmpty(data.email)){
        errors.email = "Email field is required";
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "Password field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};