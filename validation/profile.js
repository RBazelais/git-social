const Validator = require('validator');
const isEmpty = require('./is-empty');

// NOTE: every thing validator recieves must be a string
module.exports = function validateProfileInput(data){
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if(!Validator.isLength(data.handle, { min: 2, max: 40 })){
        errors.handle = 'Handle needs to be between 2 and 4 characters';
    }

    if(Validator.isEmpty(data.handle)){
        errors.handle = 'Profile handle field is required';
    }

    if(Validator.isEmpty(data.status)){
        errors.status = 'Profile status field is required';
    }

    if(Validator.isEmpty(data.skills)){
        errors.skills = 'Profile skills field is required';
    }

    // check to see if url is not empty, then check if it is actually a URL
    if(!isEmpty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.website = 'Not a valid URL';
        }
    }

    if(!isEmpty(data.twitter)){
        if(!Validator.isURL(data.twitter)){
            errors.twitter = 'Not a valid URL';
        }
    }

    if(!isEmpty(data.linkedin)){
        if(!Validator.isURL(data.linkedin)){
            errors.linkedin = 'Not a valid URL';
        }
    }

    if(!isEmpty(data.instagram)){
        if(!Validator.isURL(data.instagram)){
            errors.instagram = 'Not a valid URL';
        }
    }

    if(!isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)){
            errors.facebook = 'Not a valid URL';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};