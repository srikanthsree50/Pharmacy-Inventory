const required = function (params, key) {

    let requiredFields = {
        Login: ['PhoneNumber', 'Password'],
        CreateUser: ['PhoneNumber', 'Password', 'FirstName', 'LastName']
    };
    let missingFields = [];
    let _fields = requiredFields[key];

    _fields.forEach((item) => {
        if(params[item] === null || params[item] === undefined){
            missingFields.push(item);
        }
    });
    return {
        Status: missingFields.length === 0,
        MissingFields: missingFields,
        RequiredFields: requiredFields
    }
};

module.exports = {
    required: required
};