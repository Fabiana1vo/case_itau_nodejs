const { CustomError } = require("../../../commom/errors/custom-error");
const { formatSuccessResponse } = require("../../../commom/utils/response-formatter");
const logger = require("../../../config/logger")("CLIENT_SERVICE");
const clientValidations = require("../../../commom/validations/client-validations");
const clientService = require("../services/client-service");

/**
 * @async
 * @function exports.getClients
 * @description Retrieves all clients from the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<Array<object>>} List of all clients.
 * @throws {CustomError} 500 ('Error retrieving clients').
 */

exports.getClients = async (req, res, next) => {
  try {
    const response = await clientService.findAll();
    res
      .status(200)
      .json(
        formatSuccessResponse(response, "Clientes localizados com sucesso!")
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function exports.getClient
 * @description Retrieves a client by their ID from the database.
 * @param {object} req - Express request object containing the client ID in params.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<object>} Client found by ID.
 * @throws {CustomError} 400 ('Invalid ID provided'), 500 ('Error retrieving client').
 */

exports.getClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!clientValidations.isValidNumericId(id)) {
      throw new CustomError("Informe um ID válido", 400, "BAD_REQUEST");
    }

    const response = await clientService.find(id);
    res
      .status(200)
      .json(formatSuccessResponse(response, "Cliente localizado com sucesso!"));
  } catch (error) {
    next(error);
  }
};


/**
 * @async
 * @function exports.createClient
 * @description Creates a new client in the database.
 * @param {object} req - Express request object containing client data (nome, email) in the body.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<object>} Newly created client.
 * @throws {CustomError} 400 ('Missing required fields: [nome, email]', 'Invalid email provided'), 500 ('Error creating client').
 */
exports.createClient = async (req, res, next) => {
  try {
    logger.info("Iniciando a criação de um novo cliente");
    const { nome, email } = req.body;

    if (
      !clientValidations.isNotUndefinedOrNullValue(email) ||
      !clientValidations.isNotUndefinedOrNullValue(nome)
    ) {
      const errors = [];
      if (!nome) errors.push("nome");
      if (!email) errors.push("email");
      throw new CustomError(
        `Os campos: [${errors.join(", ")}] são obrigatórios!`,
        400,
        "BAD_REQUEST"
      );
    }

    if (!clientValidations.isValidEmail(email)) {
      logger.error("O e-mail informado náo é válido");
      throw new CustomError("Informe um e-mail válido!", 400, "BAD_REQUEST");
    }

    const response = await clientService.create(nome, email);
    res
      .status(201)
      .json(formatSuccessResponse(response, "Registro realizado com sucesso!"));
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function exports.updateClient
 * @description Updates a client's information by their ID.
 * @param {object} req - Express request object containing the client ID in params and updated nome and/or email in body.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<object>} Updated client information.
 * @throws {CustomError} 400 ('At least one valid field (nome or email) must be provided'), 404 ('Invalid ID provided'), 500 ('Error updating client').
 */
exports.updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, email } = req.body;
 
    if (!clientValidations.isValidNumericId(id)) {
      throw new CustomError("Informe um ID válido", 404, "BAD_REQUEST");
    }
    if (
      (!nome || !clientValidations.isNotUndefinedOrNullValue(nome)) &&
      (!email || !clientValidations.isNotUndefinedOrNullValue(email))
    ) {
      throw new CustomError(
        "Você precisa informar pelo menos um campo válido: nome ou email.",
        400,
        "BAD_REQUEST"
      );
    }

    const response = await clientService.update(id, nome, email);
    res
      .status(200)
      .json(formatSuccessResponse(response, "Cliente atualizado com sucesso!"));
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function exports.deleteClient
 * @description Deletes a client by their ID from the database.
 * @param {object} req - Express request object containing the client ID in params.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} No content response on successful deletion.
 * @throws {CustomError} 404 ('Invalid ID provided'), 500 ('Error deleting client').
 */
exports.deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!clientValidations.isValidNumericId(id)) {
      throw new CustomError("Informe um ID válido", 404, "BAD_REQUEST");
    }

    await clientService.delete(id);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function exports.deposit
 * @description Deposits a specified amount into a client's account by their ID.
 * @param {object} req - Express request object containing the client ID in params and deposit amount (valor) in body.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<object>} Updated client account information after deposit.
 * @throws {CustomError} 400 ('Invalid deposit amount'), 404 ('Invalid ID provided'), 500 ('Error processing deposit').
 */

exports.deposit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { valor } = req.body;

    if (!clientValidations.isValidNumericId(id)) {
      throw new CustomError("Informe um ID válido", 404, "BAD_REQUEST");
    }

    if (clientValidations.isValidCurrencyValue(valor)) {
      throw new CustomError("Valor inválido", 400, "BAD_REQUEST");
    }

    const response = await clientService.deposit(id, valor);
    res
      .status(200)
      .json(formatSuccessResponse(response, "Depósito realizado com sucesso!"));
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function exports.withdraw
 * @description Withdraws a specified amount from a client's account by their ID.
 * @param {object} req - Express request object containing the client ID in params and withdrawal amount (valor) in body.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<object>} Updated client account information after withdrawal.
 * @throws {CustomError} 500 ('Error processing withdrawal').
 */

exports.withdraw = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { valor } = req.body;

    const response = await clientService.withdraw(id, valor);
    res
      .status(200)
      .json(formatSuccessResponse(response, "Saque realizado com sucesso!"));
  } catch (error) {
    next(error);
  }
};
