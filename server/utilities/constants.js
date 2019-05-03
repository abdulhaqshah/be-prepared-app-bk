const statusCodes = {
    successful  : "200",
    created     : "201",
    badRequest  : "400",
    forbidden   : "403",
    notFound    : "404"
}

const messages = {
    successful  : "has been succesful",
    created     : "has been created successfully",
    badRequest  : "This is is a bad request",
    notMatch    : "does not match",
    notFound    : "has not been found",
    updated     : "has been updated",
    invalid     : "is invalid",
    empty       : "is empty",
    notExist    : "does not exist",
    duplicate   : "already exist",
    notProvided : "not provided"
}

module.exports = {statusCodes, messages}