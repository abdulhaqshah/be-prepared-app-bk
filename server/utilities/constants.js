const statusCodes = {
    successful   : "200",
    created      : "201",
    badRequest   : "400",
    forBidden    : "403",
    notFound     : "404",
    unauthorized : "401"
}

const messages = {
    successful   : "has been succesful",
    created      : "has been created successfully",
    badRequest   : "This is is a bad request",
    notMatch     : "does not match",
    notFound     : "has not been found",
    updated      : "has been updated",
    invalid      : "is invalid",
    empty        : "is empty",
    notExist     : "does not exist",
    duplicate    : "already exists",
    notProvided  : "not provided",
    unauthorized : "Unauthorized",
    wrong        : "Something went wrong",
    logOut       : "has logout",
    deleted      : "has been deleted successfully"
}

const secretKeys = {
    tokenKey : 'I am a key for authentication token'
}

module.exports = {statusCodes, messages, secretKeys}