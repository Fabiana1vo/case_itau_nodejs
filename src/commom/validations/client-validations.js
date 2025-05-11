
function isValidNumericId(id){
    if(!id){
        return false
    }
    const regex = /^[+-]?\d+(\.\d+)?$/;
    return  regex.test(id)
}

function isValidEmail(email) {
    if(!email || email == null || email == undefined ){
        return false
    }
    const emailPattern =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(emailPattern.test(email),'emailPattern.test(email)')
    return emailPattern.test(email)
}

function isNotUndefinedOrNullValue(value) {
    if(!value) {
        return false
    }
    return value !== undefined || value !== null
}

module.exports = {
    isValidNumericId,
    isValidEmail,
    isNotUndefinedOrNullValue
}