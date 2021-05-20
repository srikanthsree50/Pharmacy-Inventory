const defaultErrorContext = function (message) {
    return {
        Success: false,
        Error: {
            IsValid: true,
            ErrorMessage: message
        }
    }
};

const anonymousTokenContext = function (exp, nbf, token, ip, accessTimeOut, refresh_token) {
    console.log(refresh_token);
    return {
        success: true,
        '.expires': new Date(exp * 1000),
        '.issued': new Date(nbf * 1000),
        access_token: token,
        ip_address: ip,
        expires_in: accessTimeOut * 60,
        refresh_token: refresh_token,
        token_type: 'bearer'
    }
};

const missingRequiredFieldsContext = function (missingFields, message) {
    return {
        Success: false,
        Error: {
            Status: true,
            Message: message ? message : "One or multiple required fields missing",
            MissingFields: missingFields
        }
    }
}

const defaultSuccessResult = function (result, recordsCount) {
    return {
        Success: true,
        Error: {
            Status: false,
            Message: "",
        },
        Results: result,
        TotalRecords: recordsCount
    }
};


const passwordOrPhoneNumberUnMatchedContext = function (message) {
    return {
        Success: false,
        Error: {
            Status: true,
            Message: message ? message : "Wrong Email or Wrong Password",
        }
    }
}

module.exports = {
    defaultErrorContext: defaultErrorContext,
    anonymousTokenContext: anonymousTokenContext,
    missingRequiredFieldsContext: missingRequiredFieldsContext,
    passwordOrPhoneNumberUnMatchedContext: passwordOrPhoneNumberUnMatchedContext,
    defaultSuccessResult: defaultSuccessResult
};
