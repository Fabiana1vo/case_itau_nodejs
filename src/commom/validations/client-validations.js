
function isValidNumericId(id){
    const regex = /^[+-]?\d+(\.\d+)?$/;
    return  regex.test(id)
}

function isValidEmail(email) {
    if(!email || email == null || email == undefined ){
        return false
    }
    const emailPattern =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email)
}

module.exports = {
    isValidNumericId,
    isValidEmail
}