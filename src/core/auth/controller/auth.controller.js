const { CustomError } = require("../../../commom/errors/custom-error");
const { formatSuccessResponse } = require("../../../commom/utils/response-formatter");
const logger = require("../../../config/logger")("AUTH_SERVICE");
const clientValidations = require("../../../commom/validations/client-validations");
const authLogin = require('../service/auth.service')

exports.authUser = async (req, res, next) => {
    try {
        const {email, nome } = req.body 
    if(!email || !clientValidations.isValidEmail(email)){
        throw new CustomError("Informe um e-mail válido!", 400, 'BAD_REQUEST')
    }

    const response = await authLogin.authUser(email, nome)
    res
      .status(200)
      .json(formatSuccessResponse(response, "Login realizado com sucesso!"));
  } catch (error) {
    next(error);
  }
};