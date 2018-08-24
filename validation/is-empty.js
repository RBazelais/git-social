const isEmpty = val => {
    // check for undefined
    // check for null
    // check for empty object - if object has no keys
    // check for an empty string

    return (
        val === undefined || 
        val === null ||
        (typeof val === 'object' && Object.keys(val).length === 0) ||
        (typeof val === 'string' && val.trim().length === 0)
    );
}

module.exports = isEmpty;