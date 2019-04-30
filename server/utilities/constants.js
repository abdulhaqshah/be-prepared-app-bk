const statusCodes = {
    successful  : "200",
    created     : "201",
    bad_request : "400",
    forbidden   : "403",
    not_found   : "404"
}

const messages = {
    successful  : "has been succesful",
    created     : "has been created successfully",
    bad_request : "This is is a bad request",
    not_match   : "does not match",
    not_found   : "has not been found",
    updated     : "has been updated",
    invalid     : "is invalid",
    empty       : "is empty",
    not_exist   : "does not exist"
}

module.exports = {statusCodes, messages}